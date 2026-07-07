# Product Requirements Document (PRD)

## Sigap Siber — MVP

| Informasi | Detail |
|---|---|
| Status dokumen | Draft v1.1 |
| Produk | Sigap Siber |
| Tahap | Minimum Viable Product (MVP) |
| Target pengguna | Publik umum, perwakilan OPD, dan petugas Bireuen-CSIRT |
| Kanal notifikasi | Telegram untuk Petugas/Admin Portal CSIRT |
| Akses pelapor | Tanpa akun, menggunakan satu nomor tiket |

## 1. Ringkasan

Sigap Siber adalah aplikasi web untuk menerima, memverifikasi, memprioritaskan, menangani, dan mendokumentasikan laporan insiden siber. Sistem dapat digunakan oleh siapa saja, termasuk masyarakat umum dan perwakilan Organisasi Perangkat Daerah (OPD), tanpa perlu membuat akun.

Setelah laporan dikirim, pelapor memperoleh satu nomor tiket untuk memeriksa status melalui menu `Cek Status Tiket`. Pelapor tidak menerima notifikasi Telegram. Ketika laporan baru masuk, sistem mengirim notifikasi Telegram kepada Petugas/Admin Portal CSIRT agar segera membuka portal dan memeriksa detail insiden.

MVP berfokus pada satu alur yang sederhana: laporan masuk, notifikasi petugas, triase, penanganan, pembaruan status, penyelesaian, dan pencatatan audit.

## 2. Latar Belakang

Pelaporan insiden melalui telepon, pesan pribadi, atau dokumen terpisah menyulitkan tim CSIRT untuk:

- memastikan setiap laporan tercatat dan ditindaklanjuti;
- menentukan prioritas berdasarkan dampak dan urgensi;
- menjaga kerahasiaan bukti serta identitas pelapor;
- memantau waktu respons dan progres penanganan;
- menyediakan riwayat komunikasi dan laporan statistik yang konsisten.

Sigap Siber menyediakan satu pintu pelaporan resmi dan ruang kerja terpusat bagi petugas Bireuen-CSIRT.

## 3. Tujuan Produk

1. Memudahkan siapa saja melaporkan dugaan insiden siber tanpa registrasi akun.
2. Memberikan kepastian kepada pelapor melalui nomor tiket dan halaman pengecekan status.
3. Membantu petugas melakukan triase, penugasan, penanganan, dan penyelesaian insiden secara terstruktur.
4. Menjaga kerahasiaan, integritas, dan jejak audit seluruh data laporan.
5. Menghasilkan statistik operasional dasar untuk evaluasi layanan Sigap Siber.

## 4. Indikator Keberhasilan MVP

- Minimal 95% laporan yang valid berhasil memperoleh nomor tiket dan memicu notifikasi Telegram kepada Petugas/Admin Portal CSIRT.
- Minimal 90% tiket baru ditinjau petugas dalam target waktu respons sesuai tingkat prioritas.
- Pelapor dapat melihat status tiket hanya dengan memasukkan nomor tiket, tanpa akun dan tanpa bantuan petugas.
- Seluruh perubahan status, penugasan, dan catatan penanganan tercatat dalam audit log.
- Detail laporan dan lampiran tidak ditampilkan pada halaman pengecekan status publik.

## 5. Ruang Lingkup MVP

### 5.1 Termasuk dalam MVP

- halaman informasi dan panduan pelaporan;
- formulir laporan tanpa akun;
- unggah bukti pendukung;
- pembuatan satu nomor tiket acak;
- halaman pengecekan status tiket bagi pelapor;
- notifikasi Telegram tiket baru kepada Petugas/Admin Portal CSIRT;
- autentikasi dan dashboard petugas;
- triase, prioritas, penugasan, pembaruan status, dan catatan tiket;
- pencarian, filter, dan ringkasan statistik dasar;
- manajemen pengguna petugas;
- audit log dan kontrol keamanan dasar.

### 5.2 Tidak termasuk dalam MVP

- akun atau dashboard permanen bagi pelapor;
- aplikasi mobile;
- chatbot dan klasifikasi otomatis berbasis AI;
- integrasi SIEM, antivirus enterprise, threat intelligence, atau SOAR;
- pembuatan tiket otomatis dari email;
- notifikasi otomatis kepada pelapor dan percakapan dua arah melalui aplikasi pesan;
- percakapan dua arah antara pelapor dan petugas melalui portal;
- single sign-on pemerintah;
- portal pengungkapan kerentanan terpisah;
- laporan eksekutif tingkat lanjut dan publikasi statistik otomatis;
- eskalasi otomatis ke BSSN atau CSIRT eksternal.

## 6. Pengguna dan Hak Akses

### 6.1 Pelapor

Pelapor dapat berasal dari publik umum maupun OPD. Pelapor tidak memiliki akun.

Pelapor dapat:

- membuat laporan;
- menerima dan menyimpan satu nomor tiket;
- memeriksa status tiket melalui menu `Cek Status Tiket` dengan memasukkan nomor tiket.

Pelapor tidak dapat melihat detail laporan, lampiran, catatan internal, identitas petugas, tiket lain, atau informasi operasional CSIRT melalui halaman pengecekan status.

### 6.2 Petugas/Admin Portal CSIRT

Petugas/Admin menggunakan akun internal dan memiliki seluruh hak pengelolaan portal MVP, yaitu:

- melihat serta memproses tiket;
- mengubah kategori, dampak, urgensi, prioritas, dan status;
- mengambil, menerima, atau memindahkan penugasan tiket;
- menulis catatan internal;
- menambahkan lampiran internal;
- menandai laporan sebagai tidak valid atau duplikat;
- melihat seluruh statistik operasional;
- membuka kembali tiket yang sudah ditutup;
- mengelola kategori, target waktu respons, konfigurasi portal, dan tujuan notifikasi Telegram;
- melihat audit log;
- membuat, mengubah, dan menonaktifkan akun Petugas/Admin lain.

Petugas/Admin tidak diperbolehkan menghapus tiket, riwayat penanganan, atau audit log secara permanen melalui antarmuka.

## 7. Alur Utama

### 7.1 Pelaporan

1. Pelapor membuka halaman laporan dan membaca ketentuan kerahasiaan.
2. Pelapor mengisi data kontak, jenis pelapor, rincian insiden, dampak, kronologi, dan bukti.
3. Sistem memvalidasi formulir, data kontak, CAPTCHA, serta lampiran.
4. Pelapor menyetujui pernyataan kebenaran informasi dan pemrosesan data.
5. Sistem membuat satu nomor tiket unik dan acak.
6. Sistem menampilkan nomor tiket kepada pelapor dan mengirim notifikasi Telegram kepada Petugas/Admin Portal CSIRT.
7. Tiket masuk ke antrean petugas dengan status `Baru`.

### 7.2 Pelacakan tanpa akun

1. Pelapor membuka halaman pelacakan.
2. Pelapor memasukkan nomor tiket.
3. Sistem menampilkan nomor tiket, status terkini, keterangan status publik, dan waktu pembaruan terakhir.

Karena nomor tiket menjadi satu-satunya kunci pencarian publik, nomor tersebut harus acak dan tidak dapat ditebak. Halaman ini tidak menampilkan identitas pelapor, kronologi, aset, kontak, lampiran, catatan internal, atau detail teknis insiden.

### 7.3 Penanganan oleh petugas

1. Petugas memverifikasi apakah laporan valid, duplikat, dan berada dalam ruang lingkup layanan.
2. Petugas menetapkan kategori, dampak, urgensi, prioritas, dan penanggung jawab.
3. Petugas mengubah status serta mengisi keterangan status publik jika diperlukan.
4. Petugas mencatat tindakan penanganan dalam catatan internal.
5. Setelah penanganan selesai, petugas mengisi ringkasan penyelesaian internal dan keterangan publik yang aman untuk ditampilkan.
6. Tiket ditandai `Selesai`, lalu dapat ditutup oleh Petugas/Admin setelah proses internal selesai.

## 8. Kebutuhan Fungsional

### 8.1 Formulir laporan

Data wajib:

- nama pelapor;
- nomor kontak aktif untuk keperluan tindak lanjut manual oleh petugas;
- jenis pelapor: `Publik Umum` atau `Perwakilan OPD`;
- nama OPD jika jenis pelapor adalah perwakilan OPD;
- kategori dugaan insiden;
- judul singkat;
- waktu pertama diketahui;
- kronologi;
- aset atau layanan terdampak;
- dampak yang dirasakan;
- persetujuan ketentuan pelaporan dan pemrosesan data.

Data opsional:

- alamat email;
- jabatan/unit kerja;
- URL, alamat IP, nama aplikasi, atau domain terdampak;
- waktu perkiraan mulai kejadian;
- langkah penanganan yang sudah dilakukan;
- lampiran bukti.

Kategori awal:

- phishing atau spoofing;
- malware;
- ransomware;
- peretasan akun;
- web defacement;
- DDoS atau gangguan ketersediaan;
- kebocoran atau kehilangan data;
- eksploitasi kerentanan aplikasi;
- aktivitas mencurigakan lainnya;
- belum diketahui.

Validasi:

- nomor kontak menggunakan format internasional dan dinormalisasi ke format `62xxxxxxxxxx`;
- waktu kejadian tidak boleh berada di masa depan;
- judul maksimal 150 karakter;
- kronologi maksimal 10.000 karakter;
- maksimal 5 lampiran per pengiriman dan total maksimal 25 MB;
- tipe lampiran yang diterima: PDF, PNG, JPG/JPEG, TXT, CSV, LOG, dan ZIP;
- nama file asli tidak digunakan sebagai nama penyimpanan;
- CAPTCHA dan rate limit wajib diterapkan.

### 8.2 Identitas tiket

- Nomor tiket menggunakan format `BIR-CSIRT-YYYY-XXXXXXXXXXXX`, dengan 12 karakter acak dari alfabet Base32 yang menghindari karakter ambigu.
- Kombinasi tahun dan bagian acak harus unik; sistem membuat ulang nomor jika terjadi collision.
- Nomor tiket tidak menggunakan urutan inkremental agar tidak mudah ditebak.
- Halaman sukses menyediakan tombol salin nomor tiket.
- Pelapor diperingatkan untuk menyimpan dan tidak membagikan nomor tiket karena nomor tersebut digunakan untuk melihat status.
- MVP tidak menyediakan pemulihan nomor tiket otomatis. Pelapor harus menghubungi pengelola Sigap Siber dan melalui verifikasi manual jika nomor hilang.

### 8.3 Status tiket

| Status | Arti |
|---|---|
| Baru | Laporan diterima dan belum diverifikasi |
| Verifikasi | Laporan sedang diperiksa kelengkapan serta validitasnya |
| Dalam Penanganan | Insiden sedang dianalisis atau ditangani |
| Menunggu Pelapor | Petugas telah menghubungi pelapor secara manual dan menunggu informasi atau tindakan |
| Selesai | Penanganan dinyatakan selesai dan keterangan hasil tersedia |
| Ditutup | Siklus tiket telah berakhir |
| Ditolak | Laporan tidak valid atau di luar ruang lingkup |
| Duplikat | Laporan berkaitan dengan tiket lain yang sudah tercatat |

Pelapor dapat melihat status dan keterangan publik yang sudah disanitasi oleh petugas. Keterangan tidak boleh memuat informasi sensitif atau nomor tiket milik pelapor lain. Alasan penolakan dan ringkasan penyelesaian publik wajib diisi sebelum status terkait diterapkan.

### 8.4 Prioritas dan target waktu respons

Petugas/Admin menentukan dampak dan urgensi, kemudian sistem menyarankan prioritas. Petugas/Admin dapat mengubah hasil dengan alasan yang tercatat.

| Prioritas | Contoh kondisi | Target tinjauan awal |
|---|---|---|
| Kritis | Layanan publik utama lumpuh, ransomware aktif, atau kebocoran data skala besar | 30 menit |
| Tinggi | Sistem penting terganggu atau kompromi aktif dengan dampak luas | 2 jam |
| Sedang | Insiden terbatas dan layanan utama masih berjalan | 8 jam kerja |
| Rendah | Percobaan serangan, konsultasi, atau dampak minimal | 1 hari kerja |

Target ini merupakan target operasional internal dan dihitung sejak tiket dibuat sampai tiket pertama kali dibuka serta diakui oleh petugas. Jam kerja dan hari libur dapat dikonfigurasi oleh Petugas/Admin.

### 8.5 Keterangan status dan catatan internal

- Petugas/Admin dapat mengisi `keterangan_status_publik` yang ditampilkan bersama status tiket.
- Keterangan publik wajib singkat, aman, dan tidak memuat data sensitif atau detail teknis yang dapat disalahgunakan.
- Catatan internal hanya dapat dibaca Petugas/Admin Portal CSIRT.
- Setiap catatan menyimpan pembuat, waktu, isi, dan lampiran jika ada.
- Catatan yang sudah dibuat tidak dapat diedit atau dihapus melalui antarmuka; koreksi dilakukan melalui catatan baru.
- Perubahan status dan keterangan publik dicatat pada audit log, tetapi halaman publik hanya menampilkan status terkini.

### 8.6 Dashboard petugas

Dashboard menampilkan:

- jumlah tiket baru, aktif, menunggu pelapor, selesai, dan melewati target respons;
- antrean tiket dengan nomor, judul, jenis pelapor, kategori, prioritas, status, umur tiket, dan penanggung jawab;
- pencarian berdasarkan nomor tiket, judul, nama pelapor, nomor kontak, OPD, aset, IP, atau domain;
- filter berdasarkan status, kategori, prioritas, jenis pelapor, OPD, penanggung jawab, dan rentang tanggal;
- pengurutan berdasarkan waktu masuk, prioritas, dan tenggat respons;
- indikator visual untuk tiket kritis dan tiket yang melewati target respons.

### 8.7 Detail tiket petugas

Halaman detail menyediakan:

- data asli laporan;
- identitas dan kontak pelapor;
- lampiran serta metadata file;
- kategori, dampak, urgensi, prioritas, status, dan penanggung jawab;
- keterangan status publik;
- catatan dan lampiran internal;
- riwayat perubahan tiket;
- tindakan untuk memperbarui status, menugaskan petugas, meminta informasi, menyelesaikan, menolak, atau menandai duplikat.

### 8.8 Notifikasi Telegram

Telegram digunakan hanya sebagai notifikasi internal satu arah kepada Petugas/Admin Portal CSIRT. Pelapor tidak menerima notifikasi Telegram dari sistem.

Notifikasi dikirim satu kali ketika laporan baru berhasil dibuat. Pesan ditujukan ke satu atau lebih chat Telegram internal, misalnya grup petugas, yang dikonfigurasi Petugas/Admin.

Pesan memuat:

- label bahwa terdapat tiket insiden siber baru;
- nomor tiket;
- kategori dugaan insiden;
- jenis pelapor: publik atau OPD;
- waktu laporan masuk;
- tautan menuju halaman login atau detail tiket internal.

Pesan tidak boleh memuat nama pelapor, nomor kontak, kronologi, aset, alamat IP, bukti, indikator kompromi, atau informasi sensitif lainnya.

Sistem harus:

- menggunakan Telegram Bot API dengan bot resmi yang dibuat dan dikelola oleh Bireuen-CSIRT;
- menyimpan ID pesan Telegram, chat ID tujuan, waktu pengiriman, status, dan kegagalan;
- mencoba ulang maksimal 3 kali dengan jeda bertahap;
- tidak menggagalkan pembuatan tiket jika notifikasi gagal;
- menampilkan indikator tiket baru dan kegagalan notifikasi pada dashboard Petugas/Admin;
- menyimpan token bot sebagai secret dan tidak menampilkannya dalam log atau antarmuka setelah disimpan.

### 8.9 Statistik dasar

Petugas/Admin dapat melihat dan memfilter:

- jumlah tiket per status, kategori, prioritas, jenis pelapor, dan OPD;
- tren jumlah tiket per hari atau bulan;
- rata-rata waktu tinjauan awal;
- persentase tiket yang memenuhi target waktu respons;
- rata-rata waktu penyelesaian;
- daftar tiket kritis dan tiket yang melewati target.

Data dapat diekspor ke CSV. Statistik publik dan ekspor PDF tidak termasuk MVP.

### 8.10 Manajemen pengguna Petugas/Admin

- Setiap Petugas/Admin dapat membuat, mengubah, dan menonaktifkan akun Petugas/Admin lain.
- Email atau username petugas harus unik.
- Autentikasi MVP menggunakan email atau username dan kata sandi dengan session cookie `HttpOnly`.
- Pembuatan akun admin awal dilakukan melalui script seed backend; fitur reset password dan undangan email belum termasuk MVP awal.
- Akun yang dinonaktifkan tidak dapat login, tetapi seluruh riwayat tindakannya tetap tersimpan.
- Penghapusan permanen akun petugas tidak tersedia melalui antarmuka.
- Sistem mencegah pengguna menonaktifkan akunnya sendiri dan mencegah penonaktifan akun aktif terakhir agar portal tidak kehilangan akses admin.

## 9. Kebutuhan Nonfungsional

### 9.1 Keamanan dan privasi

- Seluruh koneksi menggunakan HTTPS.
- Kata sandi disimpan menggunakan algoritma hash yang sesuai standar industri.
- Data sensitif dan lampiran dienkripsi saat tersimpan.
- Seluruh akun internal memiliki role tunggal `PETUGAS_ADMIN`; endpoint internal wajib menolak akses publik.
- MFA direkomendasikan untuk fase berikutnya, tetapi belum termasuk MVP awal.
- Login dibatasi dengan rate limit dan penguncian sementara setelah percobaan gagal berulang.
- Sesi petugas memakai cookie `HttpOnly`, `SameSite=Lax`, `Secure` di production, berakhir setelah 30 menit tidak aktif, dan memiliki batas absolut 8 jam.
- Lampiran disimpan di penyimpanan privat dan hanya diberikan melalui URL sementara setelah otorisasi.
- File diperiksa tipe aktualnya dan dipindai malware sebelum dapat diunduh petugas.
- Konten pengguna ditampilkan dengan escaping untuk mencegah XSS.
- Query database menggunakan parameter binding untuk mencegah SQL injection.
- Nomor kontak, identitas pelapor, token bot Telegram, chat ID internal, dan data sensitif tidak dicatat dalam application log biasa.
- Backup terenkripsi dilakukan setiap hari dan prosedur pemulihan diuji berkala.

### 9.2 Audit

Audit log mencatat:

- login berhasil dan gagal;
- akses petugas ke detail tiket dan unduhan lampiran;
- perubahan status, prioritas, kategori, dan penanggung jawab;
- perubahan keterangan status publik dan catatan internal;
- ekspor data;
- perubahan akun petugas dan konfigurasi;
- upaya pelacakan tiket yang gagal secara berulang.

Audit log bersifat append-only pada level aplikasi, mencatat aktor, waktu, alamat IP, jenis tindakan, target, serta nilai sebelum dan sesudah jika relevan.

### 9.3 Kinerja dan ketersediaan

- Halaman publik utama dimuat dalam maksimal 3 detik pada persentil ke-95 dalam kondisi operasi normal.
- Pencarian dashboard menampilkan hasil dalam maksimal 3 detik untuk minimal 100.000 tiket.
- Sistem mendukung minimal 100 pengguna aktif bersamaan pada MVP.
- Target ketersediaan bulanan adalah 99,5%, di luar pemeliharaan terjadwal.
- Kegagalan Telegram tidak boleh membuat aplikasi utama tidak tersedia.

### 9.4 Aksesibilitas dan perangkat

- Antarmuka responsif untuk ponsel, tablet, dan desktop.
- Formulir dapat digunakan dengan keyboard.
- Label, pesan kesalahan, kontras warna, dan fokus mengikuti WCAG 2.1 AA sejauh relevan untuk MVP.
- Bahasa antarmuka MVP adalah Bahasa Indonesia.

### 9.5 Retensi data

- Tiket, komunikasi, lampiran, dan audit log disimpan minimal 5 tahun sejak tiket ditutup.
- Penghapusan atau perpanjangan retensi dilakukan berdasarkan kebijakan resmi pengelola Sigap Siber dan tidak tersedia sebagai tindakan harian petugas.
- Kebijakan privasi harus menjelaskan tujuan pengumpulan, akses, penyimpanan, dan kanal permintaan terkait data pribadi.

## 10. Model Data Konseptual

Entitas minimum:

- `Ticket`: identitas, sumber pelapor, kategori, dampak, urgensi, prioritas, status, tenggat, dan waktu siklus tiket.
- `Reporter`: nama, jenis pelapor, OPD, unit/jabatan, kontak, email, dan persetujuan.
- `AffectedAsset`: jenis aset, nama, URL, domain, IP, dan deskripsi.
- `TicketNote`: catatan internal, pembuat, dan waktu.
- `Attachment`: nama asli, lokasi privat, ukuran, MIME type, hash, hasil pemindaian, dan pemilik.
- `StaffUser`: identitas Petugas/Admin, status akun, dan autentikasi.
- `AuthSession`: hash token session, Petugas/Admin terkait, waktu kedaluwarsa idle, batas absolut, IP, user agent, dan status revoke.
- `Assignment`: penanggung jawab dan riwayat penugasan.
- `StatusHistory`: perubahan status dan alasan.
- `Notification`: kanal, template, tujuan, status, percobaan, dan ID penyedia.
- `AuditLog`: aktor, aksi, target, metadata perubahan, IP, dan waktu.
- `SystemSetting`: jam kerja, target respons, kategori, template, dan konfigurasi non-rahasia.

## 11. Halaman yang Dibutuhkan

### Publik

1. Beranda/panduan pelaporan.
2. Formulir laporan insiden.
3. Konfirmasi laporan dan penyimpanan nomor tiket.
4. Form pelacakan tiket.
5. Hasil status tiket yang hanya menampilkan informasi publik.
6. Kebijakan privasi serta ketentuan pelaporan.

### Internal

1. Login Petugas/Admin dan MFA opsional.
2. Dashboard serta antrean tiket.
3. Detail dan penanganan tiket.
4. Statistik dasar.
5. Manajemen pengguna petugas.
6. Konfigurasi kategori, SLA, jam kerja, dan template Telegram.
7. Audit log.

## 12. Skenario Kegagalan dan Perilaku Sistem

- Jika Telegram internal gagal, tiket tetap dibuat; kegagalan dicatat, dicoba ulang, dan ditampilkan pada dashboard.
- Jika nomor kontak pelapor tidak valid, formulir ditolak sebelum tiket dibuat.
- Jika pemindaian lampiran gagal, file dikarantina dan tidak dapat diunduh sampai diperiksa petugas berwenang.
- Jika pencarian nomor tiket gagal berulang kali, akses dari sumber tersebut dibatasi sementara tanpa memberi petunjuk apakah nomor tertentu pernah ada.
- Jika tiket terdeteksi duplikat, petugas menghubungkannya ke tiket utama dan memberi penjelasan kepada pelapor tanpa membuka data pelapor lain.
- Jika laporan memuat ancaman keselamatan atau tindak pidana di luar kewenangan CSIRT, petugas dapat menolak atau meneruskan melalui prosedur internal; sistem hanya mencatat tindakan dan alasannya.
- Jika tiket berstatus `Menunggu Pelapor` selama 7 hari kalender, sistem menandainya pada dashboard; tindak lanjut dan penutupan tetap merupakan keputusan Petugas/Admin.

## 13. Kriteria Penerimaan MVP

MVP dinyatakan siap digunakan jika seluruh kondisi berikut terpenuhi:

1. Publik dan perwakilan OPD dapat mengirim laporan tanpa akun dari perangkat mobile dan desktop.
2. Tiket valid menghasilkan satu nomor tiket unik, acak, dan tidak inkremental.
3. Pelapor dapat melihat status dengan memasukkan nomor tiket tanpa login atau kode tambahan.
4. Hasil pengecekan hanya menampilkan nomor tiket, status, keterangan publik, dan waktu pembaruan terakhir.
5. Petugas dapat melakukan triase, menetapkan prioritas, mengubah status, dan menangani tiket sampai ditutup.
6. Catatan internal tidak pernah muncul pada halaman atau respons API pelapor.
7. Setiap tiket baru memicu notifikasi Telegram kepada tujuan internal Petugas/Admin; pelapor tidak menerima notifikasi otomatis.
8. Lampiran tidak dapat diakses melalui URL publik permanen dan file berbahaya dikarantina.
9. Seluruh tindakan sensitif petugas tercatat pada audit log.
10. Dashboard, filter, pencarian, statistik, ekspor CSV, dan manajemen akun bekerja untuk role tunggal Petugas/Admin.
11. Pengujian keamanan tidak menemukan kerentanan kritis atau tinggi yang belum ditangani.
12. Backup dan pemulihan data berhasil diuji pada lingkungan staging.

## 14. Tahapan Peluncuran

1. **Staging internal:** pengujian fungsional, keamanan, integrasi Telegram, dan simulasi insiden.
2. **Pilot terbatas:** digunakan oleh tim Bireuen-CSIRT melalui Sigap Siber dan beberapa OPD terpilih selama 2–4 minggu, sementara formulir tetap dapat diuji sebagai pengguna publik.
3. **Perbaikan pilot:** memperbaiki hambatan utama, template notifikasi, kategori, dan target respons.
4. **Peluncuran publik:** membuka kanal resmi dan mempublikasikan panduan pelaporan.
5. **Evaluasi 30 hari:** menilai volume tiket, waktu respons, kegagalan notifikasi, keamanan, dan umpan balik petugas.

## 15. Asumsi dan Dependensi

- Bireuen-CSIRT menyediakan petugas, jam operasional, SOP penanganan, serta jalur eskalasi internal.
- Nomor kontak pelapor digunakan hanya untuk tindak lanjut manual oleh petugas dan bukan bukti identitas hukum.
- Bireuen-CSIRT menentukan satu atau lebih chat Telegram internal serta membuat bot Telegram resmi sebelum uji penerimaan integrasi.
- Infrastruktur produksi menyediakan database, penyimpanan file privat, HTTPS, backup, monitoring, dan pengelolaan secret.
- Daftar OPD, kalender hari kerja, target respons final, kebijakan retensi, serta isi kebijakan privasi akan divalidasi oleh pemilik produk sebelum peluncuran publik.
- Detail teknologi dan arsitektur implementasi akan ditetapkan pada dokumen technical design terpisah.
