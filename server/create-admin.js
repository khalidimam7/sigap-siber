import { randomBytes } from 'node:crypto'
import { Pool } from 'pg'
import { hashPassword } from './auth.js'
import { loadLocalEnv } from './env.js'
import { shouldUseSsl, validateDatabaseUrl } from './database.js'

loadLocalEnv()

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL belum diatur. Isi connection string Supabase PostgreSQL di .env.local.')
  process.exit(1)
}

try {
  validateDatabaseUrl(DATABASE_URL)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}

const requiredEnv = ['ADMIN_NAME', 'ADMIN_EMAIL', 'ADMIN_USERNAME', 'ADMIN_PASSWORD']
const missing = requiredEnv.filter(key => !String(process.env[key] || '').trim())
if (missing.length) {
  console.error(`Env admin belum lengkap: ${missing.join(', ')}.`)
  console.error('Isi ADMIN_NAME, ADMIN_EMAIL, ADMIN_USERNAME, dan ADMIN_PASSWORD di .env.local lalu jalankan ulang.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: shouldUseSsl(DATABASE_URL),
})

function createUserId() {
  return `staff_${randomBytes(16).toString('hex')}`
}

async function main() {
  const name = process.env.ADMIN_NAME.trim()
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase()
  const username = process.env.ADMIN_USERNAME.trim().toLowerCase()
  const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD)

  const existing = await pool.query(
    `select id
     from staff_users
     where lower(email) = lower($1) or lower(username) = lower($2)
     limit 1`,
    [email, username],
  )

  if (existing.rowCount > 0) {
    await pool.query(
      `update staff_users
       set name = $2,
           email = $3,
           username = $4,
           password_hash = $5,
           role = 'PETUGAS_ADMIN',
           is_active = true,
           updated_at = now()
       where id = $1`,
      [existing.rows[0].id, name, email, username, passwordHash],
    )
    console.log(`Admin diperbarui: ${email} (${username})`)
    return
  }

  await pool.query(
    `insert into staff_users (id, name, email, username, password_hash, role, is_active)
     values ($1, $2, $3, $4, $5, 'PETUGAS_ADMIN', true)`,
    [createUserId(), name, email, username, passwordHash],
  )
  console.log(`Admin dibuat: ${email} (${username})`)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
  })
