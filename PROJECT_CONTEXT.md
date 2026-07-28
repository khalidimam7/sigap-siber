# Project Overview

Sigap Siber adalah prototype/MVP portal ticketing untuk pelaporan insiden siber di Kabupaten Bireuen. Project ini dibuat agar masyarakat umum maupun perwakilan OPD dapat mengirim laporan insiden tanpa membuat akun, mendapatkan nomor tiket, lalu memantau status penanganan melalui halaman cek status.

Masalah yang diselesaikan:

- Pelaporan insiden siber masih perlu kanal yang lebih terstruktur, mudah dicari, dan bisa ditindaklanjuti petugas.
- Pelapor tidak perlu menerima notifikasi atau membuat akun; cukup menyimpan nomor tiket.
- Petugas/admin perlu menerima notifikasi saat laporan baru masuk dan mengelola status tiket dari portal internal.

Target pengguna:

- Pelapor publik umum.
- Pelapor dari OPD/perangkat daerah.
- Petugas/Admin portal Sigap Siber/Bireuen-CSIRT.

# Tech Stack

- Framework frontend: React 19 + React Router DOM 7.
- Build tool: Vite 6.
- Bahasa: TypeScript untuk frontend, JavaScript ES Modules untuk backend.
- Backend: Node.js native HTTP server, tanpa Express.
- Database: PostgreSQL, saat ini ditargetkan memakai Supabase PostgreSQL.
- Auth: custom session cookie untuk petugas/admin.
- Notifikasi: Telegram Bot API untuk notifikasi internal admin saat tiket baru masuk.
- Deployment production: server Ubuntu pribadi dengan domain `sigapsiber.web.id` dari Domainesia, diakses melalui Cloudflare Zero Trust/Tunnel.
- Deployment alternatif lama: Render Web Service single service masih bisa dipakai jika diperlukan.
- Package manager: npm, dengan `package-lock.json`.

# Architecture

Project ini memakai arsitektur single repository dengan frontend dan backend dalam satu codebase.

Alur request development:

1. User membuka frontend Vite, biasanya `http://localhost:5173` atau port Vite lain.
2. Frontend memanggil endpoint `/api/*`.
3. `vite.config.ts` mem-proxy `/api` ke backend lokal `http://127.0.0.1:3001`.
4. Backend Node membaca/menulis data ke PostgreSQL.
5. Saat tiket baru dibuat, backend mencoba mengirim notifikasi ke Telegram.

Alur request production:

1. User membuka `https://sigapsiber.web.id`.
2. DNS/domain dikelola melalui Domainesia dan Cloudflare.
3. Cloudflare Zero Trust/Tunnel meneruskan trafik ke service Sigap Siber di server Ubuntu pribadi.
4. `server/index.js` menjalankan backend Node pada `HOST` dan `PORT` dari environment server.
5. Endpoint `/api/*` dilayani oleh backend.
6. File statis dari `dist` dilayani oleh backend yang sama.
7. Route frontend seperti `/lapor`, `/cek-status`, `/admin`, dan `/admin/tiket/:id` fallback ke `dist/index.html`.

Komponen utama:

- Public portal:
  - Beranda.
  - Form laporan insiden.
  - Halaman sukses berisi nomor tiket.
  - Halaman cek status tiket.
- Admin portal:
  - Login petugas/admin.
  - Dashboard ringkasan tiket dari database.
  - Daftar semua tiket.
  - Detail tiket.
  - Update status tiket.
  - Update tingkat keparahan/prioritas.
  - Update catatan publik.
  - Delete tiket.
- Backend API:
  - Public submit dan status tracking.
  - Auth session cookie.
  - Protected admin endpoints.
  - Telegram notification.
  - Audit log.
  - Migration dan seed scripts.

# Folder Structure

- `src/`
  - Frontend React app.
  - `src/App.tsx` berisi mayoritas komponen, route, UI publik, UI admin, fetch API, dan logic dashboard.
  - `src/data.ts` berisi type tiket, kategori, dan data demo/fallback.
  - `src/styles.css` berisi styling utama seluruh aplikasi.
  - `src/main.tsx` entry point React.

- `server/`
  - Backend Node.js.
  - `server/index.js` server utama, route API, logic tiket, auth middleware, Telegram, static serving production.
  - `server/auth.js` password hashing, session token, cookie helpers.
  - `server/database.js` validasi DATABASE_URL dan konfigurasi SSL PostgreSQL.
  - `server/env.js` loader `.env.local`.
  - `server/migrate.js` menjalankan SQL migration.
  - `server/seed.js` memasukkan data demo.
  - `server/create-admin.js` membuat/memperbarui akun admin awal.
  - `server/migrations/` berisi migration SQL.

- `server/migrations/`
  - `001_initial_schema.sql`: tabel tiket, attachment metadata, notifikasi, audit log.
  - `002_auth_schema.sql`: tabel staff user dan session.
  - `003_ticket_status_history.sql`: histori perubahan status tiket.

- `dist/`
  - Hasil `npm run build`.
  - Tidak masuk git.

- Root files:
  - `package.json`: scripts dan dependency.
  - `vite.config.ts`: konfigurasi Vite dan proxy `/api`.
  - `.env.example`: template environment tanpa secret.
  - `README.md`: instruksi operasional.
  - `PRD-MVP.md`: product requirements MVP.
  - `PROJECT_CONTEXT.md`: dokumen ini.

# Coding Conventions

- Frontend memakai React function components dan hooks.
- Komponen saat ini banyak berada di `src/App.tsx`; jika fitur makin besar, pecah bertahap ke file terpisah tanpa mengubah perilaku.
- Type tiket dan status utama didefinisikan di `src/data.ts`; gunakan type yang sama agar frontend konsisten.
- Backend memakai ES Modules (`type: module`) dan Node native API.
- Backend belum memakai framework seperti Express; jangan menambahkan framework besar tanpa alasan kuat.
- Endpoint API mengembalikan JSON dengan helper `sendJson`.
- Error validasi backend biasanya memakai `error.statusCode`, lalu ditangani di catch server utama.
- Naming:
  - Status tiket memakai Bahasa Indonesia: `Baru`, `Verifikasi`, `Dalam Penanganan`, `Menunggu Pelapor`, `Selesai`, `Ditutup`, `Ditolak`, `Duplikat`.
  - Prioritas/tingkat keparahan: `Rendah`, `Sedang`, `Tinggi`, `Kritis`.
  - Nomor tiket formatnya `BIR-CSIRT-<YEAR>-<RANDOM_SUFFIX>`.

Cara membuat fitur baru:

1. Tentukan apakah fitur publik atau admin.
2. Jika perlu data persisten, buat migration SQL baru di `server/migrations/`.
3. Tambahkan fungsi backend di `server/index.js` atau ekstrak modul baru jika logic mulai besar.
4. Tambahkan endpoint API.
5. Tambahkan UI/fetch logic di frontend.
6. Jalankan `npm run build`; jika menyentuh database, jalankan `npm run db:migrate`.

Hal yang harus dihindari:

- Jangan menaruh secret di frontend atau variable `VITE_*`.
- Jangan commit `.env`, `.env.local`, atau credential asli.
- Jangan mengakses Supabase langsung dari frontend untuk fitur yang membutuhkan secret.
- Jangan mengubah format status/prioritas tanpa memperbarui type, UI, backend validation, dan database usage.
- Jangan membuat pelapor wajib login; keputusan MVP adalah pelapor tetap tanpa akun.
- Jangan menambahkan dependency besar jika fungsi bisa dibuat sederhana dengan Node/React yang sudah ada.

# Environment

Daftar environment variable. Jangan isi nilai secret asli di dokumentasi atau commit.

- `NODE_ENV`
  - `development` atau `production`.
  - Mempengaruhi cookie `Secure` dan default host production.

- `APP_URL`
  - Base URL aplikasi.
  - Dipakai untuk link detail tiket di notifikasi Telegram.
  - Production saat ini: `https://sigapsiber.web.id`.

- `PORT`
  - Port backend Node.
  - Lokal default `3001`.
  - Di Ubuntu server sesuaikan dengan port service yang diteruskan oleh Cloudflare Tunnel/reverse proxy.

- `HOST`
  - Host bind backend.
  - Lokal biasanya `127.0.0.1`.
  - Production bisa `127.0.0.1` jika hanya diakses oleh Cloudflare Tunnel/reverse proxy lokal, atau `0.0.0.0` jika memang perlu bind semua interface.

- `DATABASE_URL`
  - PostgreSQL connection string.
  - Untuk Supabase dari direct connection atau shared pooler.
  - Password dengan karakter spesial harus URL-encoded.

- `DATABASE_SSL`
  - Kontrol SSL database.
  - Untuk Supabase/production umumnya `true`.

- `TELEGRAM_NOTIFICATIONS_ENABLED`
  - `true`/`false`.
  - Jika `false`, backend tetap membuat tiket tetapi tidak mengirim Telegram.

- `TELEGRAM_BOT_TOKEN`
  - Token bot Telegram dari BotFather.
  - Secret backend only.

- `TELEGRAM_ADMIN_CHAT_ID`
  - Chat ID grup/channel/admin yang menerima notifikasi tiket baru.

- `TELEGRAM_FALLBACK_CHAT_ID`
  - Opsional; ada di template env, tetapi belum dipakai aktif oleh backend utama.

- `TELEGRAM_PARSE_MODE`
  - Mode parse Telegram, default `HTML`.

- `APP_SECRET`
  - Secret backend umum.
  - Saat ini belum banyak dipakai, tetapi tetap disiapkan untuk production.

- `JWT_SECRET`
  - Secret untuk kebutuhan token di masa depan.
  - Saat ini auth menggunakan session cookie custom, bukan JWT aktif.

- `ADMIN_NAME`
  - Nama akun admin awal untuk script `npm run auth:create-admin`.

- `ADMIN_EMAIL`
  - Email akun admin awal.

- `ADMIN_USERNAME`
  - Username akun admin awal.

- `ADMIN_PASSWORD`
  - Password akun admin awal.
  - Hanya dipakai oleh script create/update admin; jangan simpan di frontend.

# External Services

- Database:
  - Supabase PostgreSQL.
  - Gunakan shared pooler/IPv4-friendly connection string jika direct connection IPv6 bermasalah.

- Storage:
  - Belum ada storage file production.
  - Lampiran saat ini hanya disimpan sebagai metadata/nama file di tabel `ticket_attachments`.

- Telegram:
  - Telegram Bot API dipakai untuk notifikasi internal petugas/admin saat tiket baru masuk.
  - Pelapor tidak menerima notifikasi Telegram/WhatsApp.

- Auth:
  - Custom auth berbasis `staff_users` dan `auth_sessions`.
  - Password di-hash dengan Node `crypto.scrypt`.
  - Session token disimpan sebagai hash di database dan dikirim ke browser sebagai HttpOnly cookie `sigap_siber_session`.

- Cloud/deployment:
  - Production saat ini berjalan di server Ubuntu pribadi.
  - Domain: `sigapsiber.web.id`, dibeli melalui Domainesia.
  - Akses publik memakai Cloudflare Zero Trust/Tunnel.
  - Repo tetap disiapkan agar `npm run build` menghasilkan frontend dan `npm run start` melayani frontend + backend.
  - Render Web Service pernah direncanakan sebagai opsi demo sementara, tetapi bukan deployment utama saat ini.

- API lain:
  - Tidak ada API eksternal lain selain Telegram dan PostgreSQL.

# Current Progress

Fitur yang sudah selesai/terimplementasi:

- Branding system-wide menjadi “Sigap Siber”.
- Portal publik dengan halaman beranda, lapor, sukses, dan cek status.
- Pelapor boleh publik umum maupun OPD.
- Pelapor tidak wajib akun.
- Nomor tiket diberikan setelah submit laporan.
- Backend PostgreSQL untuk tiket.
- Migration database untuk tiket, attachment metadata, notifikasi, audit log, user admin, session, dan histori status.
- Submit tiket ke database.
- Cek status publik berdasarkan nomor tiket.
- Portal admin dengan login session cookie.
- Endpoint admin dilindungi session.
- Dashboard admin memakai data tiket dari backend/database.
- Badge jumlah tiket di sidebar dan tab daftar tiket memakai data real.
- Detail tiket admin.
- Update status tiket.
- Update tingkat keparahan/prioritas tiket.
- Update public note/status note.
- Delete tiket.
- Histori status untuk menampilkan tanggal/waktu perubahan status di cek status publik.
- Notifikasi Telegram untuk admin saat tiket baru masuk.
- Static serving production dari backend Node.
- Aplikasi sudah dideploy di server Ubuntu pribadi dengan domain `sigapsiber.web.id`.
- Domain memakai Domainesia dan akses publik memakai Cloudflare Zero Trust/Tunnel.

Fitur yang sedang dikerjakan/area transisi:

- Stabilization deployment production di Ubuntu server pribadi.
- Validasi konfigurasi Cloudflare Zero Trust/Tunnel untuk route publik dan admin.
- Hardening production sebelum dipakai publik luas.

Fitur yang belum dibuat atau belum production-ready:

- Upload file fisik ke storage privat.
- Download lampiran dengan otorisasi.
- Pemindaian malware/file validation untuk lampiran.
- Manajemen user admin real di UI.
- Reset password dan invitation user.
- MFA.
- Pengaturan Telegram yang benar-benar tersimpan dari UI.
- Catatan internal persisten.
- Statistik detail yang sepenuhnya real di halaman `/admin/statistik`.
- Rate limit public cek status dan submit laporan.
- CSRF protection eksplisit untuk endpoint admin.
- Export CSV di sebagian UI masih perlu dipastikan memakai data real di semua halaman.
- Kebijakan privasi/ketentuan pelaporan final.
- Retensi data dan archival.

# Design Decisions

- Single service production.
  - Frontend dan backend dilayani dari satu domain `sigapsiber.web.id` agar session cookie admin sederhana dan tidak perlu CORS/cross-site cookie rumit.
  - Cloudflare Zero Trust/Tunnel meneruskan trafik dari domain publik ke service Node di Ubuntu server.

- Pelapor tanpa akun.
  - Sesuai MVP: friction pelaporan harus rendah. Pelapor cukup menyimpan nomor tiket.

- Admin memakai session cookie, bukan JWT di frontend.
  - Cookie HttpOnly lebih aman karena token tidak disimpan di JavaScript/browser storage.
  - Session bisa dicabut dari database.

- Password hashing pakai `crypto.scrypt`.
  - Menghindari dependency tambahan.
  - Cukup untuk MVP jika parameter dan password policy dijaga.

- Backend native Node, bukan Express.
  - Project masih kecil dan endpoint terbatas.
  - Mengurangi dependency dan kompleksitas awal.

- PostgreSQL sebagai source of truth.
  - Data tiket harus persisten setelah restart/redeploy.
  - Supabase dipilih sebagai managed PostgreSQL awal.

- Telegram menggantikan WhatsApp.
  - WhatsApp API biasanya berbayar/lebih rumit.
  - Telegram Bot API lebih mudah dan gratis untuk notifikasi internal admin.

- Lampiran baru metadata/nama file.
  - Upload file production membutuhkan storage privat, scanning, limit, dan otorisasi download; ditunda agar MVP cepat stabil.

- Audit log append-style.
  - Aksi penting seperti login, view/list admin, update, delete, dan ticket created dicatat.

# Known Issues

- `src/App.tsx` masih terlalu besar dan memuat banyak komponen sekaligus; refactor diperlukan saat fitur bertambah.
- Sebagian halaman admin masih prototype/hardcoded, terutama `/admin/statistik`, `/admin/pengguna`, dan `/admin/pengaturan`.
- Catatan internal pada detail tiket belum persisten.
- Lampiran belum benar-benar di-upload; hanya nama file.
- Public form belum mengirim binary file.
- CORS saat ini memakai `Access-Control-Allow-Origin: *`; aman untuk local/proxy, tetapi perlu ditinjau jika API dipisah origin.
- Belum ada CSRF token untuk endpoint admin yang memakai cookie.
- Login rate limit masih in-memory; akan reset saat server restart dan tidak cocok untuk multi-instance.
- `APP_SECRET` dan `JWT_SECRET` tersedia di env tetapi belum menjadi pusat mekanisme auth saat ini.
- Delete tiket bersifat hard delete; untuk produksi mungkin perlu soft delete/retention policy.
- Konfigurasi Cloudflare Zero Trust perlu dipastikan tidak memblokir halaman publik `/`, `/lapor`, dan `/cek-status`.
- Jika Cloudflare Access dipakai, sebaiknya hanya diterapkan ke route admin atau layer tambahan yang tidak mengganggu pelapor publik.
- Operasional Ubuntu server belum terdokumentasi penuh, misalnya process manager, restart policy, backup, dan monitoring.

# Development Workflow

Install dependency:

```bash
npm install
```

Siapkan env lokal:

```bash
cp .env.example .env.local
```

Isi minimal:

```env
DATABASE_URL=postgresql://...
DATABASE_SSL=true
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_CHAT_ID=...
APP_SECRET=...
JWT_SECRET=...
```

Jalankan migration:

```bash
npm run db:migrate
```

Opsional seed data demo:

```bash
npm run db:seed
```

Buat/update admin awal:

```bash
npm run auth:create-admin
```

Jalankan backend lokal:

```bash
npm run api
```

Jalankan frontend lokal:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Jalankan production local:

```bash
npm run start
```

Deploy production di Ubuntu server + Cloudflare Zero Trust:

- Domain publik: `https://sigapsiber.web.id`.
- Pastikan repository sudah berada di server Ubuntu.
- Jalankan `npm install`.
- Isi environment production di server, tanpa prefix `VITE_` untuk secret.
- Jalankan migration dan buat admin terhadap database production.
- Build frontend dengan `npm run build`.
- Jalankan app dengan `npm run start` melalui process manager seperti `systemd` atau `pm2` jika tersedia.
- Arahkan Cloudflare Tunnel/Zero Trust ke origin lokal service Node, misalnya `http://127.0.0.1:3001`.
- Pastikan `APP_URL=https://sigapsiber.web.id` agar link Telegram benar.
- Pastikan route `/api/*` dan semua route frontend masuk ke service yang sama.

Environment production contoh:

```env
NODE_ENV=production
APP_URL=https://sigapsiber.web.id
HOST=127.0.0.1
PORT=3001
DATABASE_URL=postgresql://...
DATABASE_SSL=true
TELEGRAM_NOTIFICATIONS_ENABLED=true
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_CHAT_ID=...
TELEGRAM_PARSE_MODE=HTML
APP_SECRET=...
JWT_SECRET=...
```

Deploy alternatif lama ke Render:

- Type: Web Service.
- Build command: `npm install && npm run build`.
- Start command: `npm run start`.
- Health check path: `/api/health`.
- Environment production harus diisi di dashboard Render.
- Jalankan migration dan create admin sebelum deploy pertama, atau jalankan dari local terhadap database production.

Test manual penting:

- Submit tiket baru dari `/lapor`.
- Pastikan nomor tiket muncul.
- Pastikan notifikasi Telegram admin masuk.
- Cek nomor tiket di `/cek-status`.
- Login admin di `/admin/login`.
- Buka daftar tiket dan detail tiket.
- Update status/prioritas.
- Cek status publik menampilkan perubahan.
- Delete tiket dan pastikan tidak muncul lagi.

# Roadmap

Prioritas berikutnya:

1. Verifikasi production end-to-end di `https://sigapsiber.web.id`.
2. Dokumentasikan operasional Ubuntu server: process manager, restart policy, log, backup, dan update flow.
3. Review Cloudflare Zero Trust: pastikan halaman publik tetap terbuka dan admin mendapat proteksi yang sesuai.
4. Review security untuk cookie/session, CORS, CSRF, dan rate limit.
5. Implement persistent internal notes.
6. Implement storage lampiran privat, validasi file, dan otorisasi download.
7. Buat manajemen user admin real.
8. Buat reset password atau invitation flow.
9. Buat halaman statistik real dari database.
10. Tambahkan filter/sort/pagination tiket.
11. Tambahkan soft delete atau retention policy.
12. Tambahkan automated tests minimal untuk API utama.
13. Pecah `src/App.tsx` menjadi struktur komponen/page/hooks yang lebih maintainable.

# Files Worth Reading

Urutan file yang paling penting dipahami:

1. `README.md`
   - Instruksi setup, env, database, build, dan deploy.

2. `PRD-MVP.md`
   - Konteks produk, scope MVP, flow, dan requirement.

3. `server/index.js`
   - Backend utama, route API, logic tiket, Telegram, auth guard, static serving.

4. `server/migrations/001_initial_schema.sql`
   - Struktur tabel utama tiket, attachment metadata, notifikasi, audit log.

5. `server/migrations/002_auth_schema.sql`
   - Struktur user admin dan session.

6. `server/migrations/003_ticket_status_history.sql`
   - Struktur histori status tiket.

7. `server/auth.js`
   - Password hash, session token, cookie.

8. `server/database.js`
   - Validasi connection string dan SSL PostgreSQL.

9. `src/App.tsx`
   - Semua route dan UI utama.

10. `src/data.ts`
    - Type tiket, status, prioritas, kategori, dan data demo/fallback.

11. `src/styles.css`
    - Styling utama.

12. `vite.config.ts`
    - Proxy API development.

13. `.env.example`
    - Daftar environment variable.

14. `package.json`
    - Scripts dan dependencies.

# AI Instructions

- Jangan mengubah arsitektur besar tanpa alasan kuat. Project sengaja dibuat single service untuk menyederhanakan cookie auth dan deploy MVP.
- Ikuti pola coding yang sudah ada sebelum melakukan refactor besar.
- Jangan menambahkan dependency baru jika fitur bisa dibuat dengan Node/React yang sudah tersedia.
- Jangan menaruh secret di frontend, `VITE_*`, dokumentasi, atau commit.
- Jangan membaca/menampilkan isi `.env.local` ke user kecuali nilai sudah jelas bukan secret.
- Backend adalah satu-satunya pihak yang boleh membaca `DATABASE_URL`, Telegram token, dan secret auth.
- Pelapor harus tetap bisa submit dan cek status tanpa akun.
- Endpoint admin harus tetap dilindungi session cookie.
- Jika menambah tabel/kolom, buat migration SQL baru dan jangan edit migration lama yang sudah mungkin diterapkan di database production.
- Jika menambah status/prioritas, update type frontend, validation backend, UI badge/style, dan public timeline.
- Jika menyentuh auth, perhatikan cookie HttpOnly, SameSite, Secure production, idle timeout, absolute timeout, dan audit log.
- Jika menyentuh notifikasi Telegram, pastikan tiket tetap dibuat walau notifikasi gagal.
- Jika menyentuh deploy, pertahankan `npm run build` dan `npm run start` agar deployment Ubuntu/Cloudflare tetap kompatibel.
- Jalankan minimal `npm run build` setelah perubahan frontend/backend yang signifikan.
- Pertahankan bahasa UI utama dalam Bahasa Indonesia.
