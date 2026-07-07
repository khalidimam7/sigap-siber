export type TicketStatus =
  | 'Baru'
  | 'Verifikasi'
  | 'Dalam Penanganan'
  | 'Menunggu Pelapor'
  | 'Selesai'
  | 'Ditutup'
  | 'Ditolak'
  | 'Duplikat'

export type Priority = 'Kritis' | 'Tinggi' | 'Sedang' | 'Rendah'

export type TicketStatusHistory = {
  status: TicketStatus
  changedAt: string
  changedAtIso?: string
  changedBy?: string
}

export type Ticket = {
  id: string
  title: string
  reporter: string
  reporterType: 'Publik' | 'OPD'
  agency?: string
  contact: string
  category: string
  priority: Priority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  createdAtIso?: string
  updatedAtIso?: string
  asset: string
  chronology: string
  impact: string
  assignee: string
  publicNote: string
  email?: string
  occurredAt?: string
  attachments?: string[]
  statusHistory?: TicketStatusHistory[]
  notification?: {
    channel: string
    status: string
    description?: string
  }
}

export const demoTicketId = 'BIR-CSIRT-2026-A7K9M2Q4WX6P'

export const tickets: Ticket[] = [
  {
    id: demoTicketId,
    title: 'Website layanan publik menampilkan halaman asing',
    reporter: 'Muhammad Fadli',
    reporterType: 'OPD',
    agency: 'Dinas Pelayanan Terpadu',
    contact: '6281267459012',
    category: 'Web Defacement',
    priority: 'Kritis',
    status: 'Dalam Penanganan',
    createdAt: '22 Jun 2026, 14.32 WIB',
    updatedAt: '22 Jun 2026, 15.18 WIB',
    asset: 'layanan.bireuenkab.go.id',
    chronology:
      'Saat melakukan pengecekan rutin, halaman utama website berubah menjadi tampilan yang tidak dikenal. Tim internal telah menonaktifkan akses publik sementara.',
    impact: 'Portal pelayanan tidak dapat digunakan oleh masyarakat sejak pukul 14.10 WIB.',
    assignee: 'Rahmat Hidayat',
    publicNote: 'Laporan sedang dianalisis oleh tim Sigap Siber.',
  },
  {
    id: 'BIR-CSIRT-2026-Q4P8C2N7LM5R',
    title: 'Email phishing mengatasnamakan Sekretariat Daerah',
    reporter: 'Nur Aini',
    reporterType: 'OPD',
    agency: 'Dinas Pendidikan',
    contact: '6285267112844',
    category: 'Phishing / Spoofing',
    priority: 'Tinggi',
    status: 'Verifikasi',
    createdAt: '22 Jun 2026, 13.05 WIB',
    updatedAt: '22 Jun 2026, 13.20 WIB',
    asset: 'Akun email kedinasan',
    chronology: 'Beberapa pegawai menerima email berisi tautan formulir login palsu.',
    impact: 'Dua pegawai sempat membuka tautan, belum diketahui apakah kredensial dimasukkan.',
    assignee: 'Belum ditugaskan',
    publicNote: 'Laporan telah diterima dan sedang diverifikasi.',
  },
  {
    id: 'BIR-CSIRT-2026-H9X3K6V2FD8M',
    title: 'Akun media sosial perangkat desa diambil alih',
    reporter: 'Syarifuddin',
    reporterType: 'Publik',
    contact: '6281360987211',
    category: 'Peretasan Akun',
    priority: 'Sedang',
    status: 'Baru',
    createdAt: '22 Jun 2026, 12.41 WIB',
    updatedAt: '22 Jun 2026, 12.41 WIB',
    asset: 'Akun media sosial',
    chronology: 'Akun mengirim pesan permintaan uang tanpa sepengetahuan pemilik.',
    impact: 'Pesan penipuan telah dikirim ke beberapa kontak.',
    assignee: 'Belum ditugaskan',
    publicNote: 'Laporan telah diterima dan menunggu pemeriksaan petugas.',
  },
  {
    id: 'BIR-CSIRT-2026-R5J8W3T9BN2Q',
    title: 'Komputer kantor terindikasi malware',
    reporter: 'M. Rizki',
    reporterType: 'OPD',
    agency: 'Kecamatan Peusangan',
    contact: '6282273501188',
    category: 'Malware',
    priority: 'Sedang',
    status: 'Menunggu Pelapor',
    createdAt: '21 Jun 2026, 10.12 WIB',
    updatedAt: '22 Jun 2026, 09.04 WIB',
    asset: 'PC Administrasi',
    chronology: 'Perangkat menampilkan pop-up berulang dan berjalan lambat.',
    impact: 'Satu perangkat tidak digunakan sementara.',
    assignee: 'Cut Nadia',
    publicNote: 'Tim menunggu informasi tambahan yang telah diminta melalui kontak pelapor.',
  },
  {
    id: 'BIR-CSIRT-2026-M6D2S7A4KP9X',
    title: 'Percobaan login berulang pada panel admin',
    reporter: 'Agus Salim',
    reporterType: 'OPD',
    agency: 'Dinas Kesehatan',
    contact: '6282168840512',
    category: 'Aktivitas Mencurigakan',
    priority: 'Rendah',
    status: 'Selesai',
    createdAt: '20 Jun 2026, 16.22 WIB',
    updatedAt: '21 Jun 2026, 11.15 WIB',
    asset: 'Panel admin aplikasi internal',
    chronology: 'Log memperlihatkan percobaan login berulang dari IP luar negeri.',
    impact: 'Tidak ditemukan akses berhasil.',
    assignee: 'Rahmat Hidayat',
    publicNote: 'Pemeriksaan telah selesai dan rekomendasi pengamanan telah diberikan.',
  },
]

export const categories = [
  'Phishing / Spoofing',
  'Malware',
  'Ransomware',
  'Peretasan Akun',
  'Web Defacement',
  'DDoS / Gangguan Layanan',
  'Kebocoran Data',
  'Eksploitasi Kerentanan',
  'Aktivitas Mencurigakan',
  'Belum Diketahui',
]
