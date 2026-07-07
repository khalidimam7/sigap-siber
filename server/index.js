import { createServer } from 'node:http'
import { randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { Pool } from 'pg'
import {
  clearSessionCookie,
  createSessionToken,
  getSessionToken,
  hashSessionToken,
  sessionCookie,
  verifyPassword,
} from './auth.js'
import { loadLocalEnv } from './env.js'
import { shouldUseSsl, validateDatabaseUrl } from './database.js'

loadLocalEnv()

const PORT = Number(process.env.PORT || 3001)
const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1')
const DATABASE_URL = process.env.DATABASE_URL
const SESSION_IDLE_MINUTES = 30
const SESSION_ABSOLUTE_HOURS = 8
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_FAILED_ATTEMPTS = 5
const failedLoginAttempts = new Map()
const DIST_DIR = path.join(process.cwd(), 'dist')
const INDEX_HTML = path.join(DIST_DIR, 'index.html')
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

validateDatabaseUrl(DATABASE_URL)

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: shouldUseSsl(DATABASE_URL),
})

async function readJson(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  const raw = Buffer.concat(chunks).toString('utf8')
  try {
    return JSON.parse(raw)
  } catch {
    const error = new Error('Body JSON tidak valid.')
    error.statusCode = 400
    throw error
  }
}

function sendJson(res, statusCode, data, extraHeaders = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    ...extraHeaders,
  })
  res.end(JSON.stringify(data))
}

function notFound(res) {
  sendJson(res, 404, { error: 'Resource tidak ditemukan.' })
}

function sendPlain(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end(message)
}

function isPathInside(parent, child) {
  const relative = path.relative(parent, child)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

async function serveFile(res, filePath) {
  const extension = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[extension] || 'application/octet-stream'
  const contents = await readFile(filePath)
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': filePath.includes(`${path.sep}assets${path.sep}`)
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
  })
  res.end(contents)
}

async function serveFrontend(req, res, pathname) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    sendPlain(res, 405, 'Method not allowed.')
    return
  }

  if (!existsSync(INDEX_HTML)) {
    sendPlain(res, 404, 'Frontend build belum tersedia. Jalankan npm run build terlebih dahulu.')
    return
  }

  let decodedPathname
  try {
    decodedPathname = decodeURIComponent(pathname)
  } catch {
    sendPlain(res, 400, 'Path tidak valid.')
    return
  }

  const relativePath = decodedPathname === '/' ? 'index.html' : decodedPathname.replace(/^\/+/, '')
  const candidatePath = path.join(DIST_DIR, relativePath)
  if (!isPathInside(DIST_DIR, candidatePath)) {
    sendPlain(res, 403, 'Forbidden.')
    return
  }

  try {
    const fileStat = await stat(candidatePath)
    if (fileStat.isFile()) {
      await serveFile(res, candidatePath)
      return
    }
  } catch {
    // Fall through to SPA fallback or asset 404.
  }

  if (path.extname(decodedPathname)) {
    sendPlain(res, 404, 'File tidak ditemukan.')
    return
  }

  await serveFile(res, INDEX_HTML)
}

function isDatabaseConnectionError(error) {
  return ['ENOTFOUND', 'EHOSTUNREACH', 'ECONNREFUSED', 'ETIMEDOUT'].includes(error?.code)
}

function databaseConnectionMessage(error) {
  if (error?.code === 'EHOSTUNREACH' && String(error.address || '').includes(':')) {
    return 'Database Supabase tidak bisa dijangkau melalui IPv6 dari jaringan lokal ini. Gunakan Supabase pooler/IPv4 connection string sebagai DATABASE_URL, lalu restart API.'
  }
  return 'Database tidak bisa dijangkau. Periksa DATABASE_URL, koneksi internet, dan pastikan migration sudah dijalankan.'
}

function unauthorized(res) {
  sendJson(res, 401, { error: 'Sesi tidak valid atau sudah berakhir. Silakan login ulang.' })
}

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  return forwarded || req.socket.remoteAddress || 'unknown'
}

function toSafeUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    username: row.username,
    role: row.role || 'PETUGAS_ADMIN',
  }
}

function loginAttemptKey(req, identifier) {
  return `${getClientIp(req)}|${String(identifier || '').trim().toLowerCase()}`
}

function isLoginRateLimited(req, identifier) {
  const key = loginAttemptKey(req, identifier)
  const attempt = failedLoginAttempts.get(key)
  if (!attempt) return false
  if (Date.now() - attempt.firstFailedAt > LOGIN_WINDOW_MS) {
    failedLoginAttempts.delete(key)
    return false
  }
  return attempt.count >= LOGIN_MAX_FAILED_ATTEMPTS
}

function recordFailedLogin(req, identifier) {
  const key = loginAttemptKey(req, identifier)
  const existing = failedLoginAttempts.get(key)
  if (!existing || Date.now() - existing.firstFailedAt > LOGIN_WINDOW_MS) {
    failedLoginAttempts.set(key, { count: 1, firstFailedAt: Date.now() })
    return
  }
  existing.count += 1
  failedLoginAttempts.set(key, existing)
}

function clearFailedLogins(req, identifier) {
  failedLoginAttempts.delete(loginAttemptKey(req, identifier))
}

function normalizeReporterType(value) {
  return value === 'Perwakilan OPD' || value === 'OPD' ? 'OPD' : 'Publik'
}

function normalizeContact(value = '') {
  const digits = String(value).replace(/\D/g, '')
  if (digits.startsWith('62')) return digits
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  return digits
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    hour12: false,
  }).format(new Date(date)).replace(' pukul ', ', ') + ' WIB'
}

function generateTicketIdCandidate() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const year = new Date().getFullYear()
  const bytes = randomBytes(12)
  const suffix = Array.from(bytes, byte => alphabet[byte % alphabet.length]).join('')
  return `BIR-CSIRT-${year}-${suffix}`
}

async function generateTicketId(client = pool) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const id = generateTicketIdCandidate()
    const existing = await client.query('select 1 from tickets where id = $1 limit 1', [id])
    if (existing.rowCount === 0) return id
  }
  throw new Error('Gagal membuat nomor tiket unik.')
}

function validateTicketPayload(payload) {
  const required = ['reporterName', 'contact', 'category', 'title', 'asset', 'chronology', 'impact']
  const missing = required.filter(key => !String(payload[key] || '').trim())
  if (missing.length) {
    const error = new Error(`Field wajib belum lengkap: ${missing.join(', ')}.`)
    error.statusCode = 422
    throw error
  }
}

function toPublicTicket(ticket) {
  return {
    id: ticket.id,
    status: ticket.status,
    publicNote: ticket.publicNote,
    updatedAt: ticket.updatedAt,
    createdAt: ticket.createdAt,
    updatedAtIso: ticket.updatedAtIso,
    createdAtIso: ticket.createdAtIso,
    statusHistory: ticket.statusHistory || [],
  }
}

function toTicket(row, attachments = [], notification = null, statusHistory = []) {
  return {
    id: row.id,
    title: row.title,
    reporter: row.reporter,
    reporterType: row.reporter_type,
    agency: row.agency || '',
    contact: row.contact,
    email: row.email || '',
    category: row.category,
    priority: row.priority,
    status: row.status,
    createdAt: formatDate(row.created_at),
    updatedAt: formatDate(row.updated_at),
    createdAtIso: row.created_at ? new Date(row.created_at).toISOString() : '',
    updatedAtIso: row.updated_at ? new Date(row.updated_at).toISOString() : '',
    occurredAt: row.occurred_at || '',
    asset: row.asset,
    chronology: row.chronology,
    impact: row.impact,
    assignee: row.assignee,
    publicNote: row.public_note,
    attachments,
    notification: notification ? toNotification(notification) : null,
    statusHistory,
  }
}

function toStatusHistory(row) {
  return {
    status: row.status,
    changedAt: formatDate(row.changed_at),
    changedAtIso: row.changed_at ? new Date(row.changed_at).toISOString() : '',
    changedBy: row.changed_by,
  }
}

function toNotification(rowOrObject) {
  if (!rowOrObject) return null
  return {
    channel: rowOrObject.channel || 'telegram',
    status: rowOrObject.status,
    messageId: rowOrObject.message_id || rowOrObject.messageId,
    chatId: rowOrObject.chat_id || rowOrObject.chatId,
    providerStatus: rowOrObject.provider_status || rowOrObject.providerStatus,
    description: rowOrObject.description,
    reason: rowOrObject.reason,
    attemptedAt: rowOrObject.attempted_at || rowOrObject.attemptedAt,
    sentAt: rowOrObject.sent_at || rowOrObject.sentAt,
  }
}

async function readTickets() {
  const ticketResult = await pool.query('select * from tickets order by created_at desc')
  return hydrateTickets(ticketResult.rows)
}

async function readTicketById(id) {
  const result = await pool.query('select * from tickets where lower(id) = lower($1) limit 1', [id])
  if (result.rowCount === 0) return null
  return (await hydrateTickets(result.rows))[0]
}

async function hydrateTickets(rows) {
  if (!rows.length) return []
  const ids = rows.map(row => row.id)
  const [attachmentResult, notificationResult, statusHistoryResult] = await Promise.all([
    pool.query('select ticket_id, file_name from ticket_attachments where ticket_id = any($1::text[]) order by id asc', [ids]),
    pool.query(
      `select distinct on (ticket_id) *
       from notifications
       where ticket_id = any($1::text[])
       order by ticket_id, created_at desc`,
      [ids],
    ),
    pool.query(
      `select ticket_id, status, changed_at, changed_by
       from ticket_status_history
       where ticket_id = any($1::text[])
       order by ticket_id, changed_at asc, id asc`,
      [ids],
    ),
  ])

  const attachmentMap = new Map()
  for (const row of attachmentResult.rows) {
    const list = attachmentMap.get(row.ticket_id) || []
    list.push(row.file_name)
    attachmentMap.set(row.ticket_id, list)
  }

  const notificationMap = new Map(notificationResult.rows.map(row => [row.ticket_id, row]))
  const statusHistoryMap = new Map()
  for (const row of statusHistoryResult.rows) {
    const list = statusHistoryMap.get(row.ticket_id) || []
    list.push(toStatusHistory(row))
    statusHistoryMap.set(row.ticket_id, list)
  }

  return rows.map(row => toTicket(row, attachmentMap.get(row.id) || [], notificationMap.get(row.id), statusHistoryMap.get(row.id) || []))
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function telegramEnabled() {
  return process.env.TELEGRAM_NOTIFICATIONS_ENABLED !== 'false'
}

async function sendTelegramNotification(ticket) {
  if (!telegramEnabled()) return { channel: 'telegram', status: 'disabled' }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId) return { channel: 'telegram', status: 'skipped', reason: 'missing_config' }

  const appUrl = process.env.APP_URL || `http://localhost:${PORT}`
  const detailUrl = `${appUrl.replace(/\/$/, '')}/admin/tiket/${encodeURIComponent(ticket.id)}`
  const text = [
    '🚨 <b>Tiket Insiden Siber Baru</b>',
    '',
    `Nomor: <code>${escapeHtml(ticket.id)}</code>`,
    `Kategori: ${escapeHtml(ticket.category)}`,
    `Pelapor: ${escapeHtml(ticket.reporterType)}`,
    `Waktu: ${escapeHtml(ticket.createdAt)}`,
    '',
    `<a href="${escapeHtml(detailUrl)}">Buka portal</a>`,
  ].join('\n')

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: process.env.TELEGRAM_PARSE_MODE || 'HTML',
      disable_web_page_preview: true,
    }),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.ok === false) {
    return {
      channel: 'telegram',
      status: 'failed',
      providerStatus: response.status,
      description: result.description || 'Telegram API gagal merespons.',
      attemptedAt: new Date().toISOString(),
    }
  }

  return {
    channel: 'telegram',
    status: 'sent',
    messageId: result.result?.message_id,
    chatId,
    sentAt: new Date().toISOString(),
  }
}

async function insertNotification(ticketId, notification) {
  await pool.query(
    `insert into notifications
      (ticket_id, channel, status, message_id, chat_id, provider_status, description, reason, attempted_at, sent_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, coalesce($9::timestamptz, now()), $10::timestamptz)`,
    [
      ticketId,
      notification.channel || 'telegram',
      notification.status,
      notification.messageId ? String(notification.messageId) : null,
      notification.chatId ? String(notification.chatId) : null,
      notification.providerStatus || null,
      notification.description || null,
      notification.reason || null,
      notification.attemptedAt || null,
      notification.sentAt || null,
    ],
  )
}

async function createTicket(payload) {
  validateTicketPayload(payload)
  const client = await pool.connect()
  const reporterType = normalizeReporterType(payload.reporterType)
  const now = new Date()
  let ticket

  try {
    await client.query('begin')
    const id = await generateTicketId(client)
    const ticketResult = await client.query(
      `insert into tickets
        (id, title, reporter, reporter_type, agency, contact, email, category, priority, status, occurred_at, asset, chronology, impact, assignee, public_note, created_at, updated_at)
       values
        ($1, $2, $3, $4, $5, $6, $7, $8, 'Sedang', 'Baru', $9, $10, $11, $12, 'Belum ditugaskan', 'Laporan telah diterima dan menunggu pemeriksaan petugas.', $13, $13)
       returning *`,
      [
        id,
        String(payload.title).trim(),
        String(payload.reporterName).trim(),
        reporterType,
        reporterType === 'OPD' ? String(payload.agency || '').trim() : '',
        normalizeContact(payload.contact),
        String(payload.email || '').trim(),
        String(payload.category).trim(),
        String(payload.occurredAt || '').trim(),
        String(payload.asset).trim(),
        String(payload.chronology).trim(),
        String(payload.impact).trim(),
        now,
      ],
    )

    const attachments = Array.isArray(payload.attachmentNames) ? payload.attachmentNames.slice(0, 5) : []
    for (const fileName of attachments) {
      await client.query('insert into ticket_attachments (ticket_id, file_name) values ($1, $2)', [id, String(fileName)])
    }

    await client.query(
      `insert into ticket_status_history (ticket_id, status, changed_by, changed_at)
       values ($1, 'Baru', 'system', $2)`,
      [id, now],
    )

    await client.query('commit')
    ticket = toTicket(ticketResult.rows[0], attachments, { channel: 'telegram', status: 'pending' }, [
      { status: 'Baru', changedAt: formatDate(now), changedAtIso: now.toISOString(), changedBy: 'system' },
    ])
  } catch (error) {
    await client.query('rollback')
    throw error
  } finally {
    client.release()
  }

  try {
    ticket.notification = await sendTelegramNotification(ticket)
  } catch (error) {
    ticket.notification = {
      channel: 'telegram',
      status: 'failed',
      description: error instanceof Error ? error.message : 'Koneksi Telegram gagal.',
      attemptedAt: new Date().toISOString(),
    }
  }

  await insertNotification(ticket.id, ticket.notification)
  return ticket
}

async function updateTicketStatus(id, payload, actor = 'system') {
  const allowedPriorities = ['Rendah', 'Sedang', 'Tinggi', 'Kritis']
  if (payload.priority && !allowedPriorities.includes(payload.priority)) {
    const error = new Error('Tingkat keparahan tidak valid.')
    error.statusCode = 422
    throw error
  }

  const client = await pool.connect()
  try {
    await client.query('begin')
    const existing = await client.query('select id, status from tickets where lower(id) = lower($1) limit 1', [id])
    if (existing.rowCount === 0) {
      await client.query('rollback')
      return null
    }

    const previousStatus = existing.rows[0].status
    const result = await client.query(
      `update tickets
       set status = coalesce($2, status),
           public_note = coalesce($3, public_note),
           priority = coalesce($4, priority),
           updated_at = now()
       where lower(id) = lower($1)
       returning *`,
      [id, payload.status || null, payload.publicNote || null, payload.priority || null],
    )

    const nextStatus = result.rows[0].status
    if (payload.status && payload.status !== previousStatus) {
      await client.query(
        `insert into ticket_status_history (ticket_id, status, changed_by, changed_at)
         values ($1, $2, $3, now())`,
        [existing.rows[0].id, nextStatus, actor],
      )
    }

    await client.query('commit')
    return (await hydrateTickets(result.rows))[0]
  } catch (error) {
    await client.query('rollback')
    throw error
  } finally {
    client.release()
  }
}

async function deleteTicket(id) {
  const result = await pool.query(
    `delete from tickets
     where lower(id) = lower($1)
     returning id, title, reporter, category, priority, status`,
    [id],
  )
  if (result.rowCount === 0) return null
  return result.rows[0]
}

async function writeAuditLog({ actor = 'system', action, targetType, targetId, metadata = {} }) {
  await pool.query(
    `insert into audit_logs (actor, action, target_type, target_id, metadata)
     values ($1, $2, $3, $4, $5::jsonb)`,
    [actor, action, targetType, targetId, JSON.stringify(metadata)],
  )
}

async function findSessionUser(req, { touch = true } = {}) {
  const token = getSessionToken(req)
  if (!token) return null

  const tokenHash = hashSessionToken(token)
  const result = await pool.query(
    `select
       s.id as session_id,
       s.expires_at,
       s.absolute_expires_at,
       u.id,
       u.name,
       u.email,
       u.username,
       u.role
     from auth_sessions s
     join staff_users u on u.id = s.user_id
     where s.token_hash = $1
       and s.revoked_at is null
       and s.expires_at > now()
       and s.absolute_expires_at > now()
       and u.is_active = true
     limit 1`,
    [tokenHash],
  )

  if (result.rowCount === 0) return null
  const row = result.rows[0]

  if (touch) {
    await pool.query(
      `update auth_sessions
       set last_seen_at = now(),
           expires_at = least(now() + ($2::text)::interval, absolute_expires_at)
       where id = $1
         and revoked_at is null`,
      [row.session_id, `${SESSION_IDLE_MINUTES} minutes`],
    )
  }

  return { sessionId: row.session_id, user: toSafeUser(row) }
}

async function requireAdmin(req, res) {
  const session = await findSessionUser(req)
  if (!session) {
    unauthorized(res)
    return null
  }
  return session
}

async function loginStaff(req, res) {
  const payload = await readJson(req)
  const identifier = String(payload.identifier || '').trim()
  const password = String(payload.password || '')

  if (!identifier || !password) {
    sendJson(res, 422, { error: 'Email/username dan kata sandi wajib diisi.' })
    return
  }

  if (isLoginRateLimited(req, identifier)) {
    await writeAuditLog({
      action: 'auth.login.failed',
      targetType: 'auth',
      targetId: identifier,
      metadata: { reason: 'rate_limited', ip: getClientIp(req) },
    })
    sendJson(res, 429, { error: 'Terlalu banyak percobaan gagal. Coba lagi dalam beberapa menit.' })
    return
  }

  const userResult = await pool.query(
    `select *
     from staff_users
     where (lower(email) = lower($1) or lower(username) = lower($1))
       and is_active = true
     limit 1`,
    [identifier],
  )
  const user = userResult.rows[0]
  const passwordValid = user ? await verifyPassword(password, user.password_hash) : false

  if (!user || !passwordValid) {
    recordFailedLogin(req, identifier)
    await writeAuditLog({
      action: 'auth.login.failed',
      targetType: 'auth',
      targetId: identifier,
      metadata: { reason: 'invalid_credentials', ip: getClientIp(req) },
    })
    sendJson(res, 401, { error: 'Email/username atau kata sandi tidak sesuai.' })
    return
  }

  clearFailedLogins(req, identifier)
  const now = Date.now()
  const expiresAt = new Date(now + SESSION_IDLE_MINUTES * 60 * 1000)
  const absoluteExpiresAt = new Date(now + SESSION_ABSOLUTE_HOURS * 60 * 60 * 1000)
  const token = createSessionToken()
  const sessionId = `sess_${randomBytes(16).toString('hex')}`

  await pool.query(
    `insert into auth_sessions
      (id, user_id, token_hash, user_agent, ip_address, expires_at, absolute_expires_at)
     values ($1, $2, $3, $4, $5, $6, $7)`,
    [
      sessionId,
      user.id,
      hashSessionToken(token),
      String(req.headers['user-agent'] || '').slice(0, 500),
      getClientIp(req),
      expiresAt,
      absoluteExpiresAt,
    ],
  )
  await pool.query('update staff_users set last_login_at = now(), updated_at = now() where id = $1', [user.id])
  await writeAuditLog({
    actor: user.id,
    action: 'auth.login.success',
    targetType: 'staff_user',
    targetId: user.id,
    metadata: { ip: getClientIp(req), sessionId },
  })

  sendJson(res, 200, { user: toSafeUser(user) }, { 'Set-Cookie': sessionCookie(token, absoluteExpiresAt) })
}

async function logoutStaff(req, res) {
  const token = getSessionToken(req)
  const session = token ? await findSessionUser(req, { touch: false }) : null
  if (token) {
    await pool.query(
      `update auth_sessions
       set revoked_at = coalesce(revoked_at, now())
       where token_hash = $1`,
      [hashSessionToken(token)],
    )
  }

  if (session) {
    await writeAuditLog({
      actor: session.user.id,
      action: 'auth.logout',
      targetType: 'staff_user',
      targetId: session.user.id,
      metadata: { sessionId: session.sessionId, ip: getClientIp(req) },
    })
  }

  sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie() })
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      sendJson(res, 204, {})
      return
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    const pathname = url.pathname

    if (req.method === 'GET' && pathname === '/api/health') {
      await pool.query('select 1')
      sendJson(res, 200, { ok: true, service: 'sigap-siber-api', database: 'postgres' })
      return
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      await loginStaff(req, res)
      return
    }

    if (req.method === 'GET' && pathname === '/api/auth/me') {
      const session = await requireAdmin(req, res)
      if (!session) return
      sendJson(res, 200, { user: session.user })
      return
    }

    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      await logoutStaff(req, res)
      return
    }

    if (req.method === 'GET' && pathname === '/api/tickets') {
      const session = await requireAdmin(req, res)
      if (!session) return
      const tickets = await readTickets()
      await writeAuditLog({
        actor: session.user.id,
        action: 'admin.tickets.list',
        targetType: 'ticket',
        metadata: { count: tickets.length },
      })
      sendJson(res, 200, { tickets })
      return
    }

    if (req.method === 'POST' && pathname === '/api/tickets') {
      const ticket = await createTicket(await readJson(req))
      await writeAuditLog({ action: 'ticket.created', targetType: 'ticket', targetId: ticket.id })
      sendJson(res, 201, { ticket: toPublicTicket(ticket), notification: ticket.notification })
      return
    }

    const publicStatusMatch = pathname.match(/^\/api\/public\/tickets\/([^/]+)\/status$/)
    if (req.method === 'GET' && publicStatusMatch) {
      const id = decodeURIComponent(publicStatusMatch[1])
      const ticket = await readTicketById(id)
      if (!ticket) return notFound(res)
      sendJson(res, 200, { ticket: toPublicTicket(ticket) })
      return
    }

    const ticketMatch = pathname.match(/^\/api\/tickets\/([^/]+)$/)
    if (ticketMatch) {
      const id = decodeURIComponent(ticketMatch[1])
      if (req.method === 'GET') {
        const session = await requireAdmin(req, res)
        if (!session) return
        const ticket = await readTicketById(id)
        if (!ticket) return notFound(res)
        await writeAuditLog({
          actor: session.user.id,
          action: 'admin.ticket.view',
          targetType: 'ticket',
          targetId: ticket.id,
        })
        sendJson(res, 200, { ticket })
        return
      }
      if (req.method === 'PATCH') {
        const session = await requireAdmin(req, res)
        if (!session) return
        const ticket = await updateTicketStatus(id, await readJson(req), session.user.id)
        if (!ticket) return notFound(res)
        await writeAuditLog({
          actor: session.user.id,
          action: 'ticket.updated',
          targetType: 'ticket',
          targetId: ticket.id,
          metadata: { source: 'admin_portal' },
        })
        sendJson(res, 200, { ticket })
        return
      }
      if (req.method === 'DELETE') {
        const session = await requireAdmin(req, res)
        if (!session) return
        const ticket = await deleteTicket(id)
        if (!ticket) return notFound(res)
        await writeAuditLog({
          actor: session.user.id,
          action: 'ticket.deleted',
          targetType: 'ticket',
          targetId: ticket.id,
          metadata: {
            source: 'admin_portal',
            title: ticket.title,
            reporter: ticket.reporter,
            category: ticket.category,
            priority: ticket.priority,
            status: ticket.status,
          },
        })
        sendJson(res, 200, { ok: true, ticket: { id: ticket.id } })
        return
      }
    }

    if (pathname.startsWith('/api/')) {
      notFound(res)
      return
    }

    await serveFrontend(req, res, pathname)
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      sendJson(res, 503, { error: databaseConnectionMessage(error) })
      return
    }
    const statusCode = error.statusCode || 500
    sendJson(res, statusCode, { error: error.message || 'Terjadi kesalahan server.' })
  }
})

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${HOST}:${PORT} sudah dipakai. Kemungkinan API Sigap Siber sudah berjalan di terminal lain.`)
    console.error('Gunakan terminal API yang sudah berjalan, hentikan dengan Ctrl+C, atau ganti PORT di .env.local.')
    process.exit(1)
  }

  console.error(error)
  process.exit(1)
})

server.listen(PORT, HOST, () => {
  console.log(`Sigap Siber API berjalan di http://${HOST}:${PORT}`)
  console.log(`Database: PostgreSQL${DATABASE_URL ? '' : ' (DATABASE_URL belum diatur)'}`)
  console.log(`Telegram notifications: ${telegramEnabled() ? 'enabled' : 'disabled'}`)
})
