import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const PASSWORD_HASH_VERSION = 'scrypt-v1'
const PASSWORD_KEY_LENGTH = 64
export const SESSION_COOKIE_NAME = 'sigap_siber_session'

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scrypt(String(password), salt, PASSWORD_KEY_LENGTH)
  return `${PASSWORD_HASH_VERSION}$${salt}$${derivedKey.toString('hex')}`
}

export async function verifyPassword(password, storedHash = '') {
  const [version, salt, hash] = String(storedHash).split('$')
  if (version !== PASSWORD_HASH_VERSION || !salt || !hash) return false

  const expected = Buffer.from(hash, 'hex')
  const actual = await scrypt(String(password), salt, expected.length)
  if (actual.length !== expected.length) return false
  return timingSafeEqual(actual, expected)
}

export function createSessionToken() {
  return randomBytes(32).toString('base64url')
}

export function hashSessionToken(token) {
  return createHash('sha256').update(String(token)).digest('hex')
}

export function parseCookies(req) {
  const cookieHeader = req.headers.cookie || ''
  const cookies = new Map()
  for (const part of cookieHeader.split(';')) {
    const [rawName, ...rawValue] = part.trim().split('=')
    if (!rawName) continue
    cookies.set(rawName, decodeURIComponent(rawValue.join('=')))
  }
  return cookies
}

export function getSessionToken(req) {
  return parseCookies(req).get(SESSION_COOKIE_NAME) || ''
}

export function sessionCookie(token, absoluteExpiresAt) {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Expires=${new Date(absoluteExpiresAt).toUTCString()}`,
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

export function clearSessionCookie() {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'Max-Age=0',
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}
