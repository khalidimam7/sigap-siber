import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { Pool } from 'pg'
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

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: shouldUseSsl(DATABASE_URL),
})

async function main() {
  const migrationsDir = path.join(process.cwd(), 'server', 'migrations')
  const files = (await readdir(migrationsDir)).filter(file => file.endsWith('.sql')).sort()
  const client = await pool.connect()

  try {
    await client.query('begin')
    await client.query(`
      create table if not exists schema_migrations (
        version text primary key,
        applied_at timestamptz not null default now()
      )
    `)

    for (const file of files) {
      const applied = await client.query('select 1 from schema_migrations where version = $1', [file])
      if (applied.rowCount > 0) {
        console.log(`skip ${file}`)
        continue
      }

      const sql = await readFile(path.join(migrationsDir, file), 'utf8')
      await client.query(sql)
      await client.query('insert into schema_migrations (version) values ($1)', [file])
      console.log(`applied ${file}`)
    }

    await client.query('commit')
  } catch (error) {
    await client.query('rollback')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
