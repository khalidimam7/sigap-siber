# Frontend MVP Sigap Siber

Prototipe sistem ticketing laporan insiden siber berdasarkan [PRD MVP](./PRD-MVP.md). Frontend sudah terhubung ke backend minimal untuk submit tiket, cek status, daftar/detail tiket admin, PostgreSQL/Supabase, dan notifikasi Telegram.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`.

Backend lokal dijalankan di terminal terpisah:

```bash
npm run api
```

Frontend akan meneruskan request `/api/*` ke `http://127.0.0.1:3001` melalui proxy Vite.

## Environment lokal

Token Telegram dan secret backend disimpan di `.env.local`. File ini sudah masuk `.gitignore`, jadi aman untuk diisi credential lokal.

```bash
cp .env.example .env.local
```

Isi minimal untuk notifikasi Telegram nanti:

```env
DATABASE_URL=postgresql://...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_CHAT_ID=...
```

Catatan: jangan memakai prefix `VITE_` untuk token bot Telegram, karena token bot hanya boleh dibaca oleh backend/server, bukan frontend.

Endpoint backend MVP:

- `GET /api/health`
- `POST /api/tickets`
- `GET /api/public/tickets/:id/status`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/tickets` — wajib login petugas
- `GET /api/tickets/:id` — wajib login petugas
- `PATCH /api/tickets/:id` — wajib login petugas

## Setup database Supabase

1. Buat project Supabase baru.
2. Salin PostgreSQL connection string ke `DATABASE_URL` di `.env.local`.
   Jika password database mengandung karakter spesial, URL-encode password dulu, misalnya `@` menjadi `%40`, `#` menjadi `%23`, `/` menjadi `%2F`, `?` menjadi `%3F`, dan `&` menjadi `%26`.
   Jika direct connection Supabase gagal dari jaringan lokal dengan error IPv6 seperti `EHOSTUNREACH`, gunakan connection string Supabase pooler/IPv4 sebagai `DATABASE_URL`.
3. Jalankan migration:

```bash
npm run db:migrate
```

4. Opsional, isi data demo:

```bash
npm run db:seed
```

5. Buat akun Petugas/Admin awal. Isi env berikut di `.env.local`:

```env
ADMIN_NAME=Petugas Sigap Siber
ADMIN_EMAIL=admin@bireuenkab.go.id
ADMIN_USERNAME=admin
ADMIN_PASSWORD=kata_sandi_kuat
```

Lalu jalankan:

```bash
npm run auth:create-admin
```

Setelah itu jalankan backend:

```bash
npm run api
```

## Build produksi

```bash
npm run build
npm run start
```

Pada production, `npm run start` menjalankan backend Node yang sekaligus melayani:

- endpoint API `/api/*`;
- file statis hasil build Vite dari folder `dist`;
- fallback route frontend seperti `/admin`, `/lapor`, dan `/cek-status` ke `dist/index.html`.

## Deploy demo ke Render

Gunakan Render **Web Service** agar frontend dan backend berada dalam satu origin. Ini membuat session cookie admin lebih sederhana dibanding memisahkan frontend dan API.

Konfigurasi Render:

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Health check path: `/api/health`

Environment production di Render:

```env
NODE_ENV=production
HOST=0.0.0.0
DATABASE_URL=postgresql://...pooler.supabase.com:6543/postgres
DATABASE_SSL=true
APP_URL=https://alamat-render-kamu.onrender.com
APP_SECRET=replace_with_random_secret
JWT_SECRET=replace_with_random_secret
TELEGRAM_BOT_TOKEN=replace_with_telegram_bot_token
TELEGRAM_ADMIN_CHAT_ID=replace_with_admin_group_chat_id
TELEGRAM_NOTIFICATIONS_ENABLED=true
TELEGRAM_PARSE_MODE=HTML
```

Sebelum deploy pertama, pastikan database dan akun admin sudah siap dari lokal:

```bash
npm run db:migrate
npm run auth:create-admin
```

Jika URL Render berubah setelah service dibuat, update `APP_URL` di Render lalu redeploy agar tautan Telegram mengarah ke alamat yang benar.

## Halaman utama

- `/` — portal publik
- `/lapor` — formulir laporan
- `/cek-status` — pengecekan status tiket
- `/admin/login` — login petugas
- `/admin` — dashboard petugas
- `/admin/tiket` — daftar tiket
- `/admin/statistik` — statistik
- `/admin/pengguna` — manajemen pengguna
- `/admin/pengaturan` — konfigurasi Telegram internal

## Data demo

- Nomor tiket: `BIR-CSIRT-2026-A7K9M2Q4WX6P`
- Login petugas memakai akun yang dibuat melalui `npm run auth:create-admin`.

## Batas frontend saat ini

- Autentikasi Petugas/Admin sudah memakai session cookie; MFA, reset password, dan invitation belum diterapkan.
- Catatan internal, pengaturan, export, dan unggah file belum persisten penuh.
- Lampiran baru disimpan sebagai nama file saja; upload file fisik belum diterapkan.
