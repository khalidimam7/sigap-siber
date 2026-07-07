import dns from 'node:dns'

dns.setDefaultResultOrder?.('ipv4first')

export function validateDatabaseUrl(connectionString) {
  if (!connectionString) {
    throw new Error('DATABASE_URL belum diatur. Isi connection string Supabase PostgreSQL di .env.local atau environment production.')
  }

  try {
    const parsed = new URL(connectionString)
    if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
      throw new Error('protocol')
    }
    if (!parsed.hostname || !parsed.username || !parsed.pathname || parsed.pathname === '/') {
      throw new Error('shape')
    }
  } catch {
    throw new Error(
      [
        'DATABASE_URL tidak valid.',
        'Gunakan format Supabase PostgreSQL seperti:',
        'postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres',
        'Jika password berisi karakter spesial seperti @, #, /, ?, &, atau :, URL-encode dulu password tersebut.',
        'Contoh: @ menjadi %40, # menjadi %23, / menjadi %2F, ? menjadi %3F, & menjadi %26.',
      ].join(' '),
    )
  }
}

export function shouldUseSsl(connectionString = '') {
  if (process.env.DATABASE_SSL) return process.env.DATABASE_SSL !== 'false'
  const needsSsl = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')
  return needsSsl ? { rejectUnauthorized: false } : false
}
