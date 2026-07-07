import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Headphones,
  Info,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  Paperclip,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TicketCheck,
  Trash2,
  UploadCloud,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { categories, demoTicketId, Ticket, tickets } from './data'

const Logo = ({ compact = false }: { compact?: boolean }) => (
  <div className="brand">
    <div className="brand-mark"><ShieldCheck size={compact ? 21 : 25} strokeWidth={2.1} /></div>
    {!compact && (
      <div>
        <strong>SIGAP<span> SIBER</span></strong>
        <small>Portal Insiden Siber</small>
      </div>
    )}
  </div>
)

const PublicHeader = () => {
  const [open, setOpen] = useState(false)
  return (
    <header className="public-header">
      <div className="container header-inner">
        <Link to="/" aria-label="Beranda Sigap Siber"><Logo /></Link>
        <nav className={open ? 'public-nav open' : 'public-nav'}>
          <NavLink to="/">Beranda</NavLink>
          <a href="/#alur">Alur Pelaporan</a>
          <a href="/#jenis">Jenis Insiden</a>
          <NavLink to="/cek-status">Cek Status</NavLink>
          <Link className="button button-primary button-small" to="/lapor">Lapor Insiden <ArrowRight size={16} /></Link>
        </nav>
        <button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-label="Buka navigasi">
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}

const PublicFooter = () => (
  <footer className="public-footer">
    <div className="container footer-grid">
      <div>
        <Logo />
        <p>Prototype portal pelaporan insiden siber.</p>
      </div>
      <div>
        <h4>Navigasi</h4>
        <Link to="/lapor">Lapor Insiden</Link>
        <Link to="/cek-status">Cek Status Tiket</Link>
        <Link to="/admin/login">Portal Petugas</Link>
      </div>
      <div>
        <h4>Kontak Darurat Siber</h4>
        <p>Dinas Komunikasi, Informatika dan Persandian Kabupaten Bireuen</p>
        <a href="mailto:diskominfo@bireuenkab.go.id">diskominfo@bireuenkab.go.id</a>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>© 2026 Sigap Siber</span>
      <span>Kebijakan Privasi · Ketentuan Pelaporan</span>
    </div>
  </footer>
)

const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="public-shell">
    <PublicHeader />
    <main>{children}</main>
    <PublicFooter />
  </div>
)

function HomePage() {
  const incidentTypes = [
    { icon: <MessageCircle />, title: 'Phishing & Penipuan', text: 'Email, pesan, atau situs palsu yang mencuri data.' },
    { icon: <ShieldAlert />, title: 'Malware & Ransomware', text: 'Perangkat terinfeksi, terkunci, atau berperilaku aneh.' },
    { icon: <Activity />, title: 'Gangguan Layanan', text: 'DDoS atau layanan digital yang tidak dapat diakses.' },
    { icon: <LockKeyhole />, title: 'Kebocoran Data', text: 'Data sensitif terekspos atau berpindah tanpa izin.' },
    { icon: <UserRound />, title: 'Peretasan Akun', text: 'Akun diambil alih atau menunjukkan aktivitas asing.' },
    { icon: <FileText />, title: 'Defacement', text: 'Tampilan situs berubah tanpa persetujuan pengelola.' },
  ]

  return (
    <PublicLayout>
      <section className="hero">
        <div className="hero-grid-overlay" />
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Kanal Resmi Pelaporan Insiden Siber</div>
            <h1>Temukan ancaman.<br /><em>Laporkan segera.</em></h1>
            <p>Bantu kami menjaga ruang digital Kabupaten Bireuen. Laporkan dugaan insiden siber dengan aman, cepat, dan rahasia.</p>
            <div className="hero-actions">
              <Link className="button button-accent" to="/lapor">Lapor Insiden Sekarang <ArrowRight size={18} /></Link>
              <Link className="button button-ghost-light" to="/cek-status"><Search size={18} /> Cek Status Tiket</Link>
            </div>
            <div className="trust-row">
              <span><ShieldCheck size={17} /> Data dilindungi</span>
              <span><Clock3 size={17} /> Tersedia 24/7</span>
              <span><LockKeyhole size={17} /> Laporan rahasia</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="radar radar-1" /><div className="radar radar-2" /><div className="radar radar-3" />
            <div className="hero-shield"><Shield size={88} strokeWidth={1.3} /><span><Check size={28} /></span></div>
            <div className="floating-card card-threat"><ShieldAlert size={18} /><div><small>Ancaman terdeteksi</small><strong>Respons aktif</strong></div></div>
            <div className="floating-card card-safe"><span className="live-dot" /><div><small>Status sistem</small><strong>Terpantau</strong></div></div>
          </div>
        </div>
      </section>

      <section className="quick-status">
        <div className="container quick-status-inner">
          <div><TicketCheck size={30} /><div><strong>Sudah pernah melapor?</strong><span>Pantau progres penanganan menggunakan nomor tiket.</span></div></div>
          <Link to="/cek-status">Cek status tiket <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section id="alur" className="section section-soft">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-kicker">PROSES SEDERHANA</span>
            <h2>Tiga langkah untuk melindungi bersama</h2>
            <p>Tak perlu akun. Isi laporan, simpan nomor tiket, dan pantau statusnya.</p>
          </div>
          <div className="steps-grid">
            {[
              { no: '01', icon: <FileText />, title: 'Isi laporan', text: 'Ceritakan kronologi, aset terdampak, dan unggah bukti pendukung.' },
              { no: '02', icon: <TicketCheck />, title: 'Simpan nomor tiket', text: 'Nomor tiket acak langsung diberikan setelah laporan berhasil dikirim.' },
              { no: '03', icon: <Headphones />, title: 'Tim menindaklanjuti', text: 'Petugas menerima notifikasi, memverifikasi, dan memperbarui status.' },
            ].map((item, i) => (
              <div className="step-card" key={item.no}>
                <span className="step-no">{item.no}</span><div className="step-icon">{item.icon}</div>
                <h3>{item.title}</h3><p>{item.text}</p>{i < 2 && <ArrowRight className="step-arrow" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="jenis" className="section">
        <div className="container">
          <div className="section-heading split-heading">
            <div><span className="section-kicker">KENALI & LAPORKAN</span><h2>Apa yang dapat dilaporkan?</h2></div>
            <p>Jika ragu apakah sebuah kejadian termasuk insiden siber, tetap laporkan. Tim kami akan melakukan verifikasi.</p>
          </div>
          <div className="incident-grid">
            {incidentTypes.map((type) => <div className="incident-card" key={type.title}><div>{type.icon}</div><h3>{type.title}</h3><p>{type.text}</p><Link to="/lapor">Buat laporan <ArrowRight size={15} /></Link></div>)}
          </div>
        </div>
      </section>

      <section className="section cta-wrap">
        <div className="container cta-card">
          <div><span className="section-kicker light">JANGAN TUNDA</span><h2>Setiap menit sangat berarti.</h2><p>Semakin cepat insiden dilaporkan, semakin cepat dampaknya dapat dibatasi.</p></div>
          <Link className="button button-white" to="/lapor">Mulai Laporan <ArrowRight size={18} /></Link>
        </div>
      </section>
    </PublicLayout>
  )
}

const Field = ({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) => (
  <label className="field"><span>{label}{required && <b>*</b>}</span>{children}{hint && <small>{hint}</small>}</label>
)

type PublicTicketStatus = Pick<Ticket, 'id' | 'status' | 'publicNote' | 'createdAt' | 'updatedAt' | 'createdAtIso' | 'updatedAtIso' | 'statusHistory'>
type StaffUser = {
  id: string
  name: string
  email: string
  username: string
  role: string
}
const statusPublicNotes: Record<Ticket['status'], string> = {
  'Baru': 'Laporan telah diterima dan menunggu pemeriksaan petugas.',
  'Verifikasi': 'Laporan sedang diperiksa kelengkapan dan validitasnya.',
  'Dalam Penanganan': 'Laporan sedang dianalisis dan ditangani oleh petugas.',
  'Menunggu Pelapor': 'Petugas menunggu informasi tambahan dari pelapor.',
  'Selesai': 'Penanganan laporan telah selesai.',
  'Ditutup': 'Tiket telah ditutup.',
  'Ditolak': 'Laporan tidak dapat diproses lebih lanjut.',
  'Duplikat': 'Laporan terindikasi duplikat dengan tiket lain.',
}

async function readApiJson(response: Response) {
  const text = await response.text()
  if (!text.trim()) {
    if (!response.ok) {
      throw new Error('Backend tidak merespons dengan benar. Pastikan API berjalan dan DATABASE_URL sudah diatur.')
    }
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Respons backend bukan JSON valid. Pastikan request /api diarahkan ke backend Sigap Siber.')
  }
}

function useBackendTickets() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetch('/api/tickets', { credentials: 'include' })
      .then(async response => {
        if (response.status === 401) {
          navigate('/admin/login')
          throw new Error('Sesi berakhir. Silakan login ulang.')
        }
        if (!response.ok) throw new Error('API tiket tidak tersedia')
        return readApiJson(response)
      })
      .then(data => {
        if (active && Array.isArray(data.tickets)) setItems(data.tickets)
      })
      .catch(err => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Gagal memuat tiket.')
          setItems([])
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { tickets: items, loading, error }
}

function getInitials(name = 'Admin') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AD'
}

function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async response => {
        if (response.status === 401) {
          navigate('/admin/login', { replace: true, state: { from: location.pathname } })
          return
        }
        if (!response.ok) throw new Error('Gagal memeriksa sesi.')
        await readApiJson(response)
      })
      .catch(() => {
        navigate('/admin/login', { replace: true, state: { from: location.pathname } })
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
    }
  }, [location.pathname, navigate])

  if (checking) {
    return <div className="login-page"><div className="login-panel"><Logo /><p>Memeriksa sesi petugas...</p></div></div>
  }

  return <>{children}</>
}

function ReportPage() {
  const navigate = useNavigate()
  const [reporterType, setReporterType] = useState('Publik Umum')
  const [files, setFiles] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const form = new FormData(e.currentTarget)
    const payload = {
      reporterType,
      reporterName: String(form.get('reporterName') || ''),
      agency: String(form.get('agency') || ''),
      contact: String(form.get('contact') || ''),
      email: String(form.get('email') || ''),
      category: String(form.get('category') || ''),
      occurredAt: String(form.get('occurredAt') || ''),
      title: String(form.get('title') || ''),
      asset: String(form.get('asset') || ''),
      chronology: String(form.get('chronology') || ''),
      impact: String(form.get('impact') || ''),
      attachmentNames: files,
    }

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await readApiJson(response)
      if (!response.ok) throw new Error(data.error || 'Laporan gagal dikirim.')
      navigate(`/lapor/sukses?ticket=${encodeURIComponent(data.ticket.id)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backend belum berjalan atau laporan gagal dikirim.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      <section className="page-hero compact"><div className="container"><div className="breadcrumb"><Link to="/">Beranda</Link><span>/</span><b>Lapor Insiden</b></div><h1>Laporkan Insiden Siber</h1><p>Isi informasi sejelas mungkin. Data dan bukti laporan akan dijaga kerahasiaannya.</p></div></section>
      <section className="form-section">
        <div className="container form-layout">
          <form className="report-form" onSubmit={submit}>
            <div className="form-card">
              <div className="form-card-head"><span>1</span><div><h2>Informasi Pelapor</h2><p>Data ini membantu petugas melakukan tindak lanjut jika diperlukan.</p></div></div>
              <div className="form-grid two">
                <Field label="Jenis Pelapor" required><select name="reporterType" value={reporterType} onChange={(e) => setReporterType(e.target.value)}><option>Publik Umum</option><option>Perwakilan OPD</option></select></Field>
                <Field label="Nama Lengkap" required><input name="reporterName" required placeholder="Masukkan nama lengkap" /></Field>
                {reporterType === 'Perwakilan OPD' && <Field label="Nama OPD" required><input name="agency" required placeholder="Contoh: Dinas Pendidikan" /></Field>}
                <Field label="Nomor Kontak" required hint="Hanya untuk tindak lanjut manual, bukan notifikasi otomatis."><input name="contact" required type="tel" placeholder="08xxxxxxxxxx" /></Field>
                <Field label="Email (opsional)"><input name="email" type="email" placeholder="nama@email.go.id" /></Field>
              </div>
            </div>
            <div className="form-card">
              <div className="form-card-head"><span>2</span><div><h2>Detail Insiden</h2><p>Berikan gambaran lengkap mengenai kejadian yang ditemukan.</p></div></div>
              <div className="form-grid two">
                <Field label="Kategori Insiden" required><select name="category" required defaultValue=""><option value="" disabled>Pilih kategori</option>{categories.map(c => <option key={c}>{c}</option>)}</select></Field>
                <Field label="Waktu Pertama Diketahui" required><input name="occurredAt" required type="datetime-local" /></Field>
                <Field label="Judul Singkat" required><input name="title" required placeholder="Ringkasan singkat insiden" /></Field>
                <Field label="Aset / Layanan Terdampak" required><input name="asset" required placeholder="Domain, aplikasi, akun, atau perangkat" /></Field>
                <div className="full"><Field label="Kronologi Kejadian" required hint="Jangan menyertakan kata sandi atau kredensial aktif."><textarea name="chronology" required rows={6} placeholder="Jelaskan kapan kejadian ditemukan, apa yang terjadi, dan tindakan yang telah dilakukan..." /></Field></div>
                <div className="full"><Field label="Dampak yang Dirasakan" required><textarea name="impact" required rows={4} placeholder="Contoh: layanan tidak dapat diakses, data diduga bocor, akun diambil alih..." /></Field></div>
              </div>
            </div>
            <div className="form-card">
              <div className="form-card-head"><span>3</span><div><h2>Bukti Pendukung</h2><p>Unggah screenshot, log, atau dokumen lain bila tersedia.</p></div></div>
              <label className="dropzone">
                <UploadCloud size={30} /><strong>Tarik file ke sini atau klik untuk memilih</strong><span>PDF, PNG, JPG, TXT, CSV, LOG, ZIP · Maksimal 5 file / 25 MB</span>
                <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []).map(f => f.name))} />
              </label>
              {files.length > 0 && <div className="file-list">{files.map(f => <div key={f}><Paperclip size={16} /><span>{f}</span><button type="button" onClick={() => setFiles(files.filter(x => x !== f))}><X size={15} /></button></div>)}</div>}
            </div>
            {error && <div className="form-alert error"><AlertCircle size={18} /><span>{error}</span></div>}
            <div className="consent"><input required type="checkbox" id="consent" /><label htmlFor="consent">Saya menyatakan informasi yang diberikan benar dan menyetujui pemrosesan data untuk penanganan insiden siber.</label></div>
            <button className="button button-primary submit-button" type="submit" disabled={submitting}>{submitting ? 'Mengirim...' : 'Kirim Laporan'} <ArrowRight size={18} /></button>
          </form>
          <aside className="form-aside">
            <div className="aside-card secure-card"><ShieldCheck size={28} /><h3>Laporan Anda dilindungi</h3><p>Detail insiden dan lampiran hanya dapat dilihat oleh petugas portal Sigap Siber.</p></div>
            <div className="aside-card"><h3>Sebelum mengirim</h3><ul className="check-list"><li><Check /> Catat waktu kejadian</li><li><Check /> Siapkan screenshot atau log</li><li><Check /> Jangan unggah kata sandi</li><li><Check /> Simpan nomor tiket</li></ul></div>
            <div className="aside-alert"><Info size={18} /><p>Untuk kondisi darurat yang mengancam keselamatan, hubungi layanan darurat terkait.</p></div>
          </aside>
        </div>
      </section>
    </PublicLayout>
  )
}

function ReportSuccessPage() {
  const [searchParams] = useSearchParams()
  const ticketId = searchParams.get('ticket') || demoTicketId
  const [copied, setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard?.writeText(ticketId); setCopied(true); setTimeout(() => setCopied(false), 1800) }
  return (
    <PublicLayout>
      <section className="success-section"><div className="success-card"><div className="success-icon"><CheckCircle2 /></div><span className="section-kicker">LAPORAN BERHASIL DIKIRIM</span><h1>Terima kasih telah melapor</h1><p>Laporan Anda sudah tercatat. Simpan nomor tiket berikut untuk memeriksa status penanganan.</p><div className="ticket-code"><small>NOMOR TIKET</small><strong>{ticketId}</strong><button onClick={copy}>{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? 'Tersalin' : 'Salin'}</button></div><div className="warning-note"><AlertCircle size={20} /><p>Nomor tiket hanya ditampilkan sekarang. Simpan di tempat aman dan jangan membagikannya kepada orang lain.</p></div><div className="success-actions"><Link className="button button-primary" to={`/cek-status?ticket=${encodeURIComponent(ticketId)}`}>Cek Status Tiket</Link><Link className="button button-secondary" to="/">Kembali ke Beranda</Link></div></div></section>
    </PublicLayout>
  )
}

function TrackPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => (searchParams.get('ticket') || '').toUpperCase())
  const [searched, setSearched] = useState(false)
  const [found, setFound] = useState<PublicTicketStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const lookupTicket = async (ticketId: string) => {
    setLoading(true)
    setSearched(true)
    setFound(null)
    try {
      const response = await fetch(`/api/public/tickets/${encodeURIComponent(ticketId.trim())}/status`)
      if (!response.ok) return
      const data = await readApiJson(response)
      setFound(data.ticket)
    } finally {
      setLoading(false)
    }
  }
  const submit = (e: FormEvent) => { e.preventDefault(); lookupTicket(query) }
  useEffect(() => {
    const ticket = searchParams.get('ticket')
    if (ticket) lookupTicket(ticket)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <PublicLayout>
      <section className="page-hero status-hero"><div className="container narrow"><div className="eyebrow light"><span /> PELACAKAN LAPORAN</div><h1>Cek Status Tiket</h1><p>Masukkan nomor tiket yang Anda terima setelah mengirim laporan.</p><form className="status-search" onSubmit={submit}><TicketCheck size={21} /><input value={query} onChange={e => { setQuery(e.target.value.toUpperCase()); setSearched(false) }} placeholder="BIR-CSIRT-2026-XXXXXXXXXXXX" required /><button className="button button-accent">Cek Status</button></form><button className="demo-link" onClick={() => { setQuery(demoTicketId); setSearched(false) }}>Gunakan nomor tiket demo</button></div></section>
      <section className="status-result-section"><div className="container narrow">
        {!searched && <div className="empty-state"><Search size={35} /><h2>Status tiket akan tampil di sini</h2><p>Pastikan nomor tiket dimasukkan lengkap seperti pada halaman konfirmasi.</p></div>}
        {loading && <div className="empty-state"><Search size={35} /><h2>Mencari tiket...</h2><p>Mohon tunggu sebentar.</p></div>}
        {!loading && searched && found && <StatusResult ticket={found} />}
        {!loading && searched && !found && <div className="empty-state error"><AlertCircle size={35} /><h2>Nomor tiket tidak ditemukan</h2><p>Periksa kembali penulisan nomor tiket. Sistem tidak membedakan huruf besar dan kecil.</p></div>}
      </div></section>
    </PublicLayout>
  )
}

function StatusResult({ ticket }: { ticket: PublicTicketStatus }) {
  const step = getPublicStep(ticket.status)
  return <div className="status-card"><div className="status-card-top"><div><span className="label">NOMOR TIKET</span><strong>{ticket.id}</strong></div><StatusBadge status={ticket.status} /></div><div className="status-timeline"><div className="timeline-line"><span className={step >= 1 ? 'done' : ''}><Check /></span><i /><span className={step >= 2 ? 'done' : step === 1 ? 'current' : ''}>{step >= 2 ? <Check /> : <Activity />}</span><i /><span className={step >= 3 ? 'done' : step === 2 ? 'current' : ''}>{step >= 3 ? <Check /> : <Activity />}</span><i /><span className={step >= 4 ? 'done' : step === 3 ? 'current' : ''}><CheckCircle2 /></span></div><div className="timeline-labels"><div><b>Diterima</b><span>{getTimelineTimestamp(ticket, ['Baru'], ticket.createdAt)}</span></div><div><b>Diverifikasi</b><span>{step >= 2 ? getTimelineTimestamp(ticket, ['Verifikasi'], getFallbackTimelineTimestamp(ticket, step, 2)) : 'Menunggu'}</span></div><div><b>Ditangani</b><span>{step >= 3 ? getTimelineTimestamp(ticket, ['Dalam Penanganan', 'Menunggu Pelapor'], getFallbackTimelineTimestamp(ticket, step, 3)) : '—'}</span></div><div><b>Selesai</b><span>{step >= 4 ? getTimelineTimestamp(ticket, ['Selesai', 'Ditutup'], ticket.updatedAt) : '—'}</span></div></div></div><div className="public-update"><Info size={20} /><div><span>KETERANGAN TERKINI</span><p>{ticket.publicNote}</p><small>Diperbarui {ticket.updatedAt}</small></div></div><p className="privacy-caption"><LockKeyhole size={14} /> Demi keamanan, detail laporan tidak ditampilkan pada halaman ini.</p></div>
}

function getTimelineTimestamp(ticket: PublicTicketStatus, statuses: Ticket['status'][], fallback: string) {
  const item = ticket.statusHistory?.find(history => statuses.includes(history.status))
  return item?.changedAt || fallback
}

function getFallbackTimelineTimestamp(ticket: PublicTicketStatus, currentStep: number, targetStep: number) {
  return currentStep === targetStep ? ticket.updatedAt : ticket.updatedAt
}

function getPublicStep(status: Ticket['status']) {
  if (['Selesai', 'Ditutup'].includes(status)) return 4
  if (['Dalam Penanganan', 'Menunggu Pelapor'].includes(status)) return 3
  if (status === 'Verifikasi') return 2
  return 1
}

const StatusBadge = ({ status }: { status: Ticket['status'] }) => <span className={`badge status-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
const PriorityBadge = ({ priority }: { priority: Ticket['priority'] }) => <span className={`priority priority-${priority.toLowerCase()}`}><i />{priority}</span>

const activeTicketStatuses: Ticket['status'][] = ['Verifikasi', 'Dalam Penanganan', 'Menunggu Pelapor']
const completedTicketStatuses: Ticket['status'][] = ['Selesai', 'Ditutup']
const jakartaDayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' })
const jakartaMonthFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit' })
const jakartaWeekdayFormatter = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'short' })
const categoryColors = ['#08a88a', '#f59e0b', '#3579d3', '#8b5cf6', '#9ca3af']

function ticketDate(ticket: Ticket, key: 'createdAtIso' | 'updatedAtIso' = 'createdAtIso') {
  const value = ticket[key] || (key === 'createdAtIso' ? ticket.createdAt : ticket.updatedAt)
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function dayKey(date: Date) {
  return jakartaDayFormatter.format(date)
}

function monthKey(date: Date) {
  return jakartaMonthFormatter.format(date)
}

function formatWaitDuration(from: Date) {
  const minutes = Math.max(0, Math.floor((Date.now() - from.getTime()) / 60000))
  if (minutes < 60) return `${Math.max(1, minutes)} menit`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam ${minutes % 60} menit`
  return `${Math.floor(hours / 24)} hari ${hours % 24} jam`
}

function exportTicketsCsv(items: Ticket[]) {
  const escape = (value = '') => `"${String(value).replace(/"/g, '""')}"`
  const rows = [
    ['Nomor Tiket', 'Judul', 'Kategori', 'Prioritas', 'Status', 'Pelapor', 'Jenis Pelapor', 'OPD', 'Tanggal Dibuat'].map(escape).join(','),
    ...items.map(ticket => [
      ticket.id,
      ticket.title,
      ticket.category,
      ticket.priority,
      ticket.status,
      ticket.reporter,
      ticket.reporterType,
      ticket.agency || '',
      ticket.createdAt,
    ].map(escape).join(',')),
  ]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `sigap-siber-tiket-${dayKey(new Date())}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const adminLinks = [
  { to: '/admin', icon: <LayoutDashboard />, label: 'Dashboard', end: true },
  { to: '/admin/tiket', icon: <TicketCheck />, label: 'Semua Tiket' },
  { to: '/admin/statistik', icon: <BarChart3 />, label: 'Statistik' },
  { to: '/admin/pengguna', icon: <Users />, label: 'Pengguna' },
  { to: '/admin/pengaturan', icon: <Settings />, label: 'Pengaturan' },
]

function AdminLayout({ title, subtitle, children, action }: { title: string; subtitle?: string; children: ReactNode; action?: ReactNode }) {
  const [mobileMenu, setMobileMenu] = useState(false)
  const navigate = useNavigate()
  const [user, setUser] = useState<StaffUser | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async response => {
        if (response.status === 401) {
          navigate('/admin/login')
          return null
        }
        if (!response.ok) return null
        return readApiJson(response)
      })
      .then(data => {
        if (active && data?.user) setUser(data.user)
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [navigate])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => null)
    navigate('/admin/login', { replace: true })
  }

  const displayName = user?.name || 'Petugas Sigap Siber'
  const initials = getInitials(displayName)

  return (
    <div className="admin-shell">
      <aside className={mobileMenu ? 'admin-sidebar open' : 'admin-sidebar'}>
        <div className="sidebar-brand"><Logo /><button onClick={() => setMobileMenu(false)}><X /></button></div>
        <nav><span className="nav-label">MENU UTAMA</span>{adminLinks.map(link => <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMobileMenu(false)}>{link.icon}<span>{link.label}</span>{link.label === 'Semua Tiket' && <b>3</b>}</NavLink>)}</nav>
        <div className="sidebar-bottom"><div className="user-mini"><span>{initials}</span><div><strong>{displayName}</strong><small>Petugas / Admin</small></div><ChevronDown size={16} /></div><button type="button" onClick={logout}><LogOut size={17} /> Keluar</button></div>
      </aside>
      {mobileMenu && <button className="sidebar-backdrop" onClick={() => setMobileMenu(false)} />}
      <div className="admin-main">
        <header className="admin-topbar"><button className="icon-button admin-menu" onClick={() => setMobileMenu(true)}><Menu /></button><div className="admin-search"><Search /><input placeholder="Cari tiket, pelapor, atau aset..." /></div><div className="topbar-actions"><button className="notification-button"><Bell /><i>3</i></button><div className="topbar-avatar">{initials}</div></div></header>
        <main className="admin-content"><div className="admin-title"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>{children}</main>
      </div>
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from || '/admin'
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async response => {
        if (!response.ok) return null
        return readApiJson(response)
      })
      .then(data => {
        if (active && data?.user) navigate(redirectTo, { replace: true })
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [navigate, redirectTo])

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, password }),
      })
      const data = await readApiJson(response)
      if (!response.ok) throw new Error(data.error || 'Login gagal.')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal. Periksa kembali kredensial.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page"><div className="login-panel"><Link to="/"><Logo /></Link><div className="login-copy"><span className="section-kicker">PORTAL INTERNAL</span><h1>Selamat datang kembali</h1><p>Masuk untuk meninjau dan menangani laporan insiden siber.</p></div><form onSubmit={submit}><Field label="Email atau username"><input required value={identifier} onChange={e => setIdentifier(e.target.value)} autoComplete="username" placeholder="admin@bireuenkab.go.id" /></Field><Field label="Kata sandi"><input required type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="Masukkan kata sandi" /></Field>{error && <div className="form-alert error"><AlertCircle size={18} /><span>{error}</span></div>}<div className="login-options"><label><input type="checkbox" disabled /> Ingat perangkat ini</label><span>Reset kata sandi belum aktif</span></div><button className="button button-primary" disabled={loading}>{loading ? 'Memeriksa...' : 'Masuk ke Portal'} <ArrowRight size={18} /></button></form><div className="login-secure"><LockKeyhole size={16} /> Akses terbatas untuk petugas berwenang</div><Link className="back-public" to="/"><ArrowLeft size={16} /> Kembali ke portal publik</Link></div><div className="login-art"><div className="login-grid" /><div className="login-art-content"><div className="art-shield"><ShieldCheck /></div><h2>Satu portal.<br />Respons lebih cepat.</h2><p>Kelola laporan, pantau prioritas, dan dokumentasikan setiap langkah penanganan.</p><div className="art-stats"><div><strong>24/7</strong><span>Monitoring</span></div><div><strong>&lt; 30m</strong><span>Target kritis</span></div></div></div></div></div>
  )
}

function TicketTable({ items = tickets }: { items?: Ticket[] }) {
  return <div className="table-wrap"><table><thead><tr><th>Tiket</th><th>Kategori</th><th>Prioritas</th><th>Status</th><th>Pelapor</th><th>Masuk</th><th /></tr></thead><tbody>{items.map(ticket => <tr key={ticket.id}><td><Link className="ticket-cell" to={`/admin/tiket/${ticket.id}`}><strong>{ticket.id}</strong><span>{ticket.title}</span></Link></td><td><span className="category-cell">{ticket.category}</span></td><td><PriorityBadge priority={ticket.priority} /></td><td><StatusBadge status={ticket.status} /></td><td><strong className="reporter-name">{ticket.reporter}</strong><span className="table-muted">{ticket.reporterType}{ticket.agency ? ` · ${ticket.agency}` : ''}</span></td><td><strong className="date-cell">{ticket.createdAt.split(',')[0]}</strong><span className="table-muted">{ticket.createdAt.split(',').slice(1).join(',')}</span></td><td><Link className="row-action" to={`/admin/tiket/${ticket.id}`}><Eye size={17} /></Link></td></tr>)}</tbody></table></div>
}

function AdminDashboard() {
  const { tickets: backendTickets, loading } = useBackendTickets()
  const now = new Date()
  const todayKey = dayKey(now)
  const currentMonthKey = monthKey(now)
  const dashboard = useMemo(() => {
    const activeTickets = backendTickets.filter(ticket => activeTicketStatuses.includes(ticket.status))
    const newTickets = backendTickets.filter(ticket => ticket.status === 'Baru')
    const createdToday = backendTickets.filter(ticket => {
      const created = ticketDate(ticket)
      return created ? dayKey(created) === todayKey : false
    })
    const completedThisMonth = backendTickets.filter(ticket => {
      const updated = ticketDate(ticket, 'updatedAtIso')
      return completedTicketStatuses.includes(ticket.status) && updated ? monthKey(updated) === currentMonthKey : false
    })
    const completedToday = completedThisMonth.filter(ticket => {
      const updated = ticketDate(ticket, 'updatedAtIso')
      return updated ? dayKey(updated) === todayKey : false
    })
    const criticalActive = activeTickets.filter(ticket => ticket.priority === 'Kritis')
    const overdueTickets = activeTickets.filter(ticket => {
      const created = ticketDate(ticket)
      return created ? Date.now() - created.getTime() > 24 * 60 * 60 * 1000 : false
    })
    const oldestNewDate = newTickets
      .map(ticket => ticketDate(ticket))
      .filter((date): date is Date => Boolean(date))
      .sort((a, b) => a.getTime() - b.getTime())[0]

    const trend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now)
      date.setDate(now.getDate() - (6 - index))
      const key = dayKey(date)
      const count = backendTickets.filter(ticket => {
        const created = ticketDate(ticket)
        return created ? dayKey(created) === key : false
      }).length
      return { key, label: jakartaWeekdayFormatter.format(date), count }
    })
    const axisMax = Math.max(3, Math.ceil(Math.max(...trend.map(item => item.count), 1) / 3) * 3)
    const yAxis = [axisMax, Math.round(axisMax * 0.75), Math.round(axisMax * 0.5), Math.round(axisMax * 0.25), 0]

    const monthTickets = backendTickets.filter(ticket => {
      const created = ticketDate(ticket)
      return created ? monthKey(created) === currentMonthKey : false
    })
    const categoryCounts = monthTickets.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1
      return acc
    }, {})
    const categoryRows = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], index) => ({
        name,
        count,
        percent: monthTickets.length ? Math.round((count / monthTickets.length) * 100) : 0,
        color: categoryColors[index] || categoryColors[categoryColors.length - 1],
      }))

    return {
      activeTickets,
      newTickets,
      createdToday,
      completedThisMonth,
      completedToday,
      criticalActive,
      overdueTickets,
      oldestNewDate,
      trend,
      axisMax,
      yAxis,
      categoryRows,
    }
  }, [backendTickets, currentMonthKey, now, todayKey])

  const metrics = [
    { label: 'Tiket baru', value: String(dashboard.newTickets.length), change: `${dashboard.createdToday.length} masuk hari ini`, icon: <TicketCheck />, tone: 'blue' },
    { label: 'Dalam penanganan', value: String(dashboard.activeTickets.length), change: `${dashboard.criticalActive.length} kritis`, icon: <Activity />, tone: 'orange' },
    { label: 'Selesai bulan ini', value: String(dashboard.completedThisMonth.length), change: `${dashboard.completedToday.length} selesai hari ini`, icon: <CheckCircle2 />, tone: 'green' },
    { label: 'Melewati SLA', value: String(dashboard.overdueTickets.length), change: 'Aktif > 24 jam', icon: <Clock3 />, tone: 'red' },
  ]

  return (
    <AdminLayout title="Selamat sore, Admin" subtitle={loading ? 'Memuat ringkasan dari database...' : 'Berikut ringkasan aktivitas portal hari ini.'} action={<button className="button button-secondary" onClick={() => exportTicketsCsv(backendTickets)}><Download size={17} /> Export laporan</button>}>
      <div className="notice-banner"><div><Bell /><span>{dashboard.newTickets.length}</span></div><p>{dashboard.newTickets.length > 0 ? <><strong>Ada {dashboard.newTickets.length} laporan baru yang perlu diperiksa.</strong> Tiket tertua telah menunggu selama {dashboard.oldestNewDate ? formatWaitDuration(dashboard.oldestNewDate) : 'beberapa saat'}.</> : <><strong>Tidak ada laporan baru yang menunggu.</strong> Semua tiket baru sudah diproses atau belum ada laporan masuk.</>}</p><Link to="/admin/tiket">Lihat antrean <ArrowRight size={16} /></Link></div>
      <div className="metric-grid">
        {metrics.map(m => <div className="metric-card" key={m.label}><div className={`metric-icon ${m.tone}`}>{m.icon}</div><span>{m.label}</span><div><strong>{m.value}</strong><small className={m.tone}>{m.change}</small></div></div>)}
      </div>
      <div className="dashboard-grid">
        <section className="panel trend-panel"><div className="panel-head"><div><h2>Tren Laporan</h2><p>7 hari terakhir</p></div><select value="7 hari" disabled><option>7 hari</option></select></div><div className="chart"><div className="y-axis">{dashboard.yAxis.map(value => <span key={value}>{value}</span>)}</div><div className="bars">{dashboard.trend.map(item => <div key={item.key}><span style={{height: `${item.count / dashboard.axisMax * 100}%`}}><i>{item.count}</i></span><small>{item.label}</small></div>)}</div></div></section>
        <section className="panel category-panel"><div className="panel-head"><div><h2>Kategori Teratas</h2><p>Bulan ini</p></div></div>{dashboard.categoryRows.length > 0 ? dashboard.categoryRows.map(row => <div className="category-row" key={row.name}><div><span>{row.name}</span><b>{row.percent}%</b></div><div><i style={{width:`${row.percent}%`, background:row.color}} /></div></div>) : <div className="empty-state"><BarChart3 size={28} /><h2>Belum ada data kategori bulan ini</h2><p>Kategori akan muncul setelah laporan masuk.</p></div>}</section>
      </div>
      <section className="panel tickets-panel"><div className="panel-head"><div><h2>Tiket Terbaru</h2><p>Laporan terbaru yang masuk ke portal</p></div><Link to="/admin/tiket">Lihat semua <ArrowRight size={16} /></Link></div><TicketTable items={backendTickets.slice(0,4)} /></section>
    </AdminLayout>
  )
}

function AllTicketsPage() {
  const [search, setSearch] = useState('')
  const { tickets: backendTickets, loading } = useBackendTickets()
  const filtered = useMemo(() => backendTickets.filter(t => `${t.id} ${t.title} ${t.reporter} ${t.category}`.toLowerCase().includes(search.toLowerCase())), [backendTickets, search])
  return <AdminLayout title="Semua Tiket" subtitle={loading ? 'Memuat data dari backend...' : 'Kelola seluruh laporan insiden yang masuk.'}><section className="panel"><div className="ticket-toolbar"><div className="toolbar-search"><Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nomor tiket atau pelapor..." /></div><button className="button button-secondary"><Filter size={17} /> Filter</button><button className="button button-secondary"><Download size={17} /> Export CSV</button></div><div className="ticket-tabs"><button className="active">Semua <b>{backendTickets.length}</b></button><button>Baru <b>{backendTickets.filter(t => t.status === 'Baru').length}</b></button><button>Aktif <b>{backendTickets.filter(t => ['Verifikasi', 'Dalam Penanganan', 'Menunggu Pelapor'].includes(t.status)).length}</b></button><button>Selesai <b>{backendTickets.filter(t => ['Selesai', 'Ditutup'].includes(t.status)).length}</b></button></div><TicketTable items={filtered} /></section></AdminLayout>
}

function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tickets: backendTickets } = useBackendTickets()
  const ticket = backendTickets.find(t => t.id === id) || tickets.find(t => t.id === id) || tickets[0]
  const [status, setStatus] = useState<Ticket['status']>(ticket.status)
  const [priority, setPriority] = useState<Ticket['priority']>(ticket.priority)
  const [publicNote, setPublicNote] = useState(ticket.publicNote)
  const [savingStatus, setSavingStatus] = useState(false)
  const [deletingTicket, setDeletingTicket] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  useEffect(() => setStatus(ticket.status), [ticket.id, ticket.status])
  useEffect(() => setPriority(ticket.priority), [ticket.id, ticket.priority])
  useEffect(() => setPublicNote(ticket.publicNote), [ticket.id, ticket.publicNote])
  const saveTicketUpdate = async (nextStatus = status, nextPublicNote = publicNote, nextPriority = priority) => {
    setSavingStatus(true)
    setSaveMessage('')
    try {
      const response = await fetch(`/api/tickets/${encodeURIComponent(ticket.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus, publicNote: nextPublicNote, priority: nextPriority }),
      })
      if (response.status === 401) {
        navigate('/admin/login')
        return
      }
      const data = await readApiJson(response)
      if (!response.ok) throw new Error(data.error || 'Perubahan tiket gagal disimpan.')
      setStatus(data.ticket.status)
      setPriority(data.ticket.priority)
      setPublicNote(data.ticket.publicNote)
      setSaveMessage('Perubahan tersimpan. Halaman cek status sudah memakai data terbaru.')
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Perubahan tiket gagal disimpan.')
    } finally {
      setSavingStatus(false)
    }
  }
  const changeStatus = (nextStatus: Ticket['status']) => {
    setStatus(nextStatus)
    const nextPublicNote = statusPublicNotes[nextStatus] || publicNote
    setPublicNote(nextPublicNote)
    saveTicketUpdate(nextStatus, nextPublicNote, priority)
  }
  const changePriority = (nextPriority: Ticket['priority']) => {
    setPriority(nextPriority)
    saveTicketUpdate(status, publicNote, nextPriority)
  }
  const deleteCurrentTicket = async () => {
    const confirmed = window.confirm(`Hapus tiket ${ticket.id}? Tindakan ini akan menghapus tiket dari daftar admin dan halaman cek status.`)
    if (!confirmed) return

    setDeletingTicket(true)
    setSaveMessage('')
    try {
      const response = await fetch(`/api/tickets/${encodeURIComponent(ticket.id)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (response.status === 401) {
        navigate('/admin/login')
        return
      }
      const data = await readApiJson(response)
      if (!response.ok) throw new Error(data.error || 'Tiket gagal dihapus.')
      navigate('/admin/tiket', { replace: true })
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Tiket gagal dihapus.')
    } finally {
      setDeletingTicket(false)
    }
  }
  return <AdminLayout title="Detail Tiket" subtitle={ticket.id} action={<Link className="button button-secondary" to="/admin/tiket"><ArrowLeft size={17} /> Kembali</Link>}>
    <div className="ticket-detail-header"><div><StatusBadge status={status} /><PriorityBadge priority={priority} />{savingStatus && <span className="save-state">Menyimpan...</span>}{deletingTicket && <span className="save-state">Menghapus...</span>}{saveMessage && <span className="save-state">{saveMessage}</span>}</div><div><button className="button button-danger" onClick={deleteCurrentTicket} disabled={savingStatus || deletingTicket}><Trash2 size={16} /> Hapus Tiket</button><button className="button button-secondary"><ExternalLink size={16} /> Hubungi Pelapor</button><select value={priority} onChange={e => changePriority(e.target.value as Ticket['priority'])} disabled={savingStatus || deletingTicket} aria-label="Ubah tingkat keparahan"><option>Rendah</option><option>Sedang</option><option>Tinggi</option><option>Kritis</option></select><select value={status} onChange={e => changeStatus(e.target.value as Ticket['status'])} disabled={savingStatus || deletingTicket} aria-label="Ubah status tiket"><option>Baru</option><option>Verifikasi</option><option>Dalam Penanganan</option><option>Menunggu Pelapor</option><option>Selesai</option><option>Ditutup</option><option>Ditolak</option><option>Duplikat</option></select></div></div>
    <div className="detail-grid"><div className="detail-main">
      <section className="panel detail-card"><span className="section-kicker">RINGKASAN INSIDEN</span><h2>{ticket.title}</h2><div className="detail-pairs"><div><span>Kategori</span><strong>{ticket.category}</strong></div><div><span>Aset terdampak</span><strong>{ticket.asset}</strong></div><div><span>Waktu laporan</span><strong>{ticket.createdAt}</strong></div><div><span>Penanggung jawab</span><strong>{ticket.assignee}</strong></div></div><hr /><h3>Kronologi</h3><p>{ticket.chronology}</p><h3>Dampak</h3><p>{ticket.impact}</p></section>
      <section className="panel detail-card"><div className="panel-head"><div><h2>Lampiran</h2><p>Bukti yang disertakan pelapor</p></div></div><div className="attachment"><div><FileText /><span><strong>screenshot-halaman.png</strong><small>PNG · 1,8 MB · Pemindaian aman</small></span></div><button><Download /></button></div><div className="attachment"><div><FileText /><span><strong>access-log.zip</strong><small>ZIP · 4,2 MB · Pemindaian aman</small></span></div><button><Download /></button></div></section>
      <section className="panel detail-card"><div className="panel-head"><div><h2>Catatan Internal</h2><p>Hanya terlihat oleh petugas portal</p></div></div><textarea rows={4} placeholder="Tambahkan hasil analisis atau tindakan penanganan..." /><div className="note-actions"><button className="button button-secondary"><Paperclip size={16} /> Lampirkan</button><button className="button button-primary">Simpan Catatan</button></div><div className="activity-list"><div><span className="activity-avatar">RH</span><div><strong>Rahmat Hidayat</strong><small>22 Jun 2026, 15.18 WIB</small><p>Akses publik telah dibatasi. Tim sedang memeriksa perubahan file dan log akses terakhir.</p></div></div><div><span className="activity-icon"><Activity /></span><div><strong>Status diubah</strong><small>22 Jun 2026, 14.48 WIB</small><p>Verifikasi → Dalam Penanganan</p></div></div></div></section>
    </div><aside className="detail-side">
      <section className="panel detail-card"><h3>Informasi Pelapor</h3><div className="reporter-profile"><span>{ticket.reporter.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div><strong>{ticket.reporter}</strong><small>{ticket.reporterType}{ticket.agency ? ` · ${ticket.agency}` : ''}</small></div></div><div className="side-list"><div><span>Nomor kontak</span><strong>+{ticket.contact}</strong></div><div><span>Email</span><strong>{ticket.email || 'Tidak diisi'}</strong></div><div><span>Notifikasi Telegram</span><strong>{ticket.notification?.status || 'Belum ada'}</strong></div></div></section>
      <section className="panel detail-card"><h3>Status Publik</h3><p className="side-caption">Keterangan ini terlihat saat pelapor mengecek nomor tiket.</p><textarea rows={5} value={publicNote} onChange={e => setPublicNote(e.target.value)} /><button className="button button-primary full-button" onClick={() => saveTicketUpdate()} disabled={savingStatus}>Perbarui Keterangan</button></section>
      <section className="panel detail-card"><h3>Jejak Waktu</h3><div className="side-list"><div><span>Dibuat</span><strong>{ticket.createdAt}</strong></div><div><span>Terakhir diperbarui</span><strong>{ticket.updatedAt}</strong></div><div><span>Target respons</span><strong className="text-danger">30 menit</strong></div></div></section>
    </aside></div>
  </AdminLayout>
}

function StatsPage() {
  return <AdminLayout title="Statistik" subtitle="Ringkasan performa dan pola laporan insiden." action={<button className="button button-secondary"><Download size={17} /> Export CSV</button>}><div className="metric-grid compact-metrics"><div className="metric-card"><span>Total laporan</span><strong>132</strong><small>Juni 2026</small></div><div className="metric-card"><span>Rata-rata respons</span><strong>42m</strong><small className="green">12% lebih cepat</small></div><div className="metric-card"><span>Pemenuhan SLA</span><strong>94%</strong><small>Target 90%</small></div><div className="metric-card"><span>Rata-rata selesai</span><strong>2,4h</strong><small>Semua prioritas</small></div></div><div className="dashboard-grid"><section className="panel trend-panel"><div className="panel-head"><div><h2>Volume Laporan</h2><p>Januari–Juni 2026</p></div></div><div className="chart tall"><div className="y-axis"><span>150</span><span>100</span><span>50</span><span>0</span></div><div className="bars">{[72,89,67,104,118,132].map((v,i)=><div key={i}><span style={{height:`${v/150*100}%`}}><i>{v}</i></span><small>{['Jan','Feb','Mar','Apr','Mei','Jun'][i]}</small></div>)}</div></div></section><section className="panel category-panel"><div className="panel-head"><div><h2>Jenis Pelapor</h2><p>Juni 2026</p></div></div><div className="donut-wrap"><div className="donut"><div><strong>132</strong><span>Laporan</span></div></div><div className="donut-legend"><div><i className="teal" /><span>OPD</span><b>78%</b></div><div><i className="yellow" /><span>Publik</span><b>22%</b></div></div></div></section></div></AdminLayout>
}

function UsersPage() {
  return <AdminLayout title="Pengguna" subtitle="Kelola akun Petugas/Admin Portal CSIRT." action={<button className="button button-primary"><Plus size={17} /> Tambah Pengguna</button>}><section className="panel users-panel"><div className="ticket-toolbar"><div className="toolbar-search"><Search /><input placeholder="Cari pengguna..." /></div></div><div className="user-table"><div className="user-row user-head"><span>Pengguna</span><span>Username</span><span>Status</span><span>Login terakhir</span><span /></div>{[['Rahmat Hidayat','rahmat.h','Aktif','Hari ini, 15.42','RH'],['Cut Nadia, S.Kom','cut.nadia','Aktif','Hari ini, 14.20','CN'],['M. Reza Fahlevi','reza.f','Aktif','21 Jun 2026','MR'],['Admin Lama','admin.lama','Nonaktif','12 Mei 2026','AL']].map(u=><div className="user-row" key={u[1]}><span className="user-identity"><i>{u[4]}</i><b>{u[0]}</b></span><span>{u[1]}</span><span><em className={u[2] === 'Aktif' ? 'active-user' : 'inactive-user'}>{u[2]}</em></span><span>{u[3]}</span><button className="row-action"><Settings size={17} /></button></div>)}</div></section></AdminLayout>
}

function SettingsPage() {
  return <AdminLayout title="Pengaturan" subtitle="Konfigurasi portal dan notifikasi internal."><div className="settings-grid"><aside className="settings-nav"><button className="active"><MessageCircle /> Notifikasi Telegram</button><button><Clock3 /> SLA & Jam Kerja</button><button><FileText /> Kategori Insiden</button><button><Shield /> Keamanan</button></aside><section className="panel settings-content"><div className="settings-head"><div className="settings-icon"><MessageCircle /></div><div><h2>Notifikasi Telegram Internal</h2><p>Kirim pemberitahuan kepada petugas saat tiket baru masuk.</p></div><label className="toggle"><input type="checkbox" defaultChecked /><span /></label></div><div className="settings-status"><span className="live-dot" /><div><strong>Terhubung</strong><p>Bot Telegram siap mengirim notifikasi ke grup petugas.</p></div></div><div className="form-grid two"><Field label="Token bot Telegram"><input defaultValue="••••••••••:••••••••••••••••••••••••••••••••" /></Field><Field label="Chat ID grup utama"><input defaultValue="-1002288459012" /></Field><Field label="Chat ID grup cadangan"><input defaultValue="-1001982711344" /></Field><Field label="Mode pengiriman"><select defaultValue="bot-api"><option value="bot-api">Telegram Bot API</option><option value="webhook">Webhook internal</option></select></Field><div className="full"><Field label="Template notifikasi"><textarea rows={6} defaultValue={'🚨 Tiket Insiden Siber Baru\n\nNomor: {{ticket_number}}\nKategori: {{category}}\nPelapor: {{reporter_type}}\nWaktu: {{created_at}}\n\nBuka portal: {{admin_url}}'} /></Field></div></div><div className="template-preview"><span>PRATINJAU PESAN TELEGRAM</span><p>🚨 <strong>Tiket Insiden Siber Baru</strong><br/><br/>Nomor: BIR-CSIRT-2026-A7K9M2Q4WX6P<br/>Kategori: Web Defacement<br/>Pelapor: OPD<br/>Waktu: 22 Jun 2026, 14.32 WIB<br/><br/><a href="#">Buka portal</a></p></div><div className="settings-actions"><button className="button button-secondary">Kirim Pesan Uji</button><button className="button button-primary">Simpan Pengaturan</button></div></section></div></AdminLayout>
}

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/lapor" element={<ReportPage />} />
    <Route path="/lapor/sukses" element={<ReportSuccessPage />} />
    <Route path="/cek-status" element={<TrackPage />} />
    <Route path="/admin/login" element={<LoginPage />} />
    <Route path="/admin" element={<AuthGate><AdminDashboard /></AuthGate>} />
    <Route path="/admin/tiket" element={<AuthGate><AllTicketsPage /></AuthGate>} />
    <Route path="/admin/tiket/:id" element={<AuthGate><TicketDetailPage /></AuthGate>} />
    <Route path="/admin/statistik" element={<AuthGate><StatsPage /></AuthGate>} />
    <Route path="/admin/pengguna" element={<AuthGate><UsersPage /></AuthGate>} />
    <Route path="/admin/pengaturan" element={<AuthGate><SettingsPage /></AuthGate>} />
    <Route path="*" element={<HomePage />} />
  </Routes>
}
