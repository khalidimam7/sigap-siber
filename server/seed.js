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

const demoTickets = [
  {
    id: 'BIR-CSIRT-2026-A7K9M2Q4WX6P',
    title: 'Website layanan publik menampilkan halaman asing',
    reporter: 'Muhammad Fadli',
    reporterType: 'OPD',
    agency: 'Dinas Pelayanan Terpadu',
    contact: '6281267459012',
    email: 'pelapor@email.go.id',
    category: 'Web Defacement',
    priority: 'Kritis',
    status: 'Dalam Penanganan',
    createdAt: '2026-06-22T07:32:00.000Z',
    updatedAt: '2026-06-22T08:18:00.000Z',
    asset: 'layanan.bireuenkab.go.id',
    chronology: 'Saat melakukan pengecekan rutin, halaman utama website berubah menjadi tampilan yang tidak dikenal. Tim internal telah menonaktifkan akses publik sementara.',
    impact: 'Portal pelayanan tidak dapat digunakan oleh masyarakat sejak pukul 14.10 WIB.',
    assignee: 'Rahmat Hidayat',
    publicNote: 'Laporan sedang dianalisis oleh tim Sigap Siber.',
    attachments: ['screenshot-halaman.png', 'access-log.zip'],
    notificationStatus: 'seed',
  },
  {
    id: 'BIR-CSIRT-2026-Q4P8C2N7LM5R',
    title: 'Email phishing mengatasnamakan Sekretariat Daerah',
    reporter: 'Nur Aini',
    reporterType: 'OPD',
    agency: 'Dinas Pendidikan',
    contact: '6285267112844',
    email: 'pelapor@email.go.id',
    category: 'Phishing / Spoofing',
    priority: 'Tinggi',
    status: 'Verifikasi',
    createdAt: '2026-06-22T06:05:00.000Z',
    updatedAt: '2026-06-22T06:20:00.000Z',
    asset: 'Akun email kedinasan',
    chronology: 'Beberapa pegawai menerima email berisi tautan formulir login palsu.',
    impact: 'Dua pegawai sempat membuka tautan, belum diketahui apakah kredensial dimasukkan.',
    assignee: 'Belum ditugaskan',
    publicNote: 'Laporan telah diterima dan sedang diverifikasi.',
    attachments: [],
    notificationStatus: 'seed',
  },
]

async function main() {
  const client = await pool.connect()
  try {
    await client.query('begin')
    for (const ticket of demoTickets) {
      await client.query(
        `insert into tickets
          (id, title, reporter, reporter_type, agency, contact, email, category, priority, status, created_at, updated_at, asset, chronology, impact, assignee, public_note)
         values
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         on conflict (id) do nothing`,
        [
          ticket.id,
          ticket.title,
          ticket.reporter,
          ticket.reporterType,
          ticket.agency,
          ticket.contact,
          ticket.email,
          ticket.category,
          ticket.priority,
          ticket.status,
          ticket.createdAt,
          ticket.updatedAt,
          ticket.asset,
          ticket.chronology,
          ticket.impact,
          ticket.assignee,
          ticket.publicNote,
        ],
      )

      for (const fileName of ticket.attachments) {
        await client.query(
          `insert into ticket_attachments (ticket_id, file_name)
           values ($1, $2)
           on conflict do nothing`,
          [ticket.id, fileName],
        )
      }

      await client.query(
        `insert into notifications (ticket_id, channel, status)
         values ($1, 'telegram', $2)
         on conflict do nothing`,
        [ticket.id, ticket.notificationStatus],
      )
    }
    await client.query('commit')
    console.log('Seed demo tiket selesai.')
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
