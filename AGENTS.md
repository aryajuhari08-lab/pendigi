# AGENTS.md — Pendigi (Pena Digital)

Portal artikel dan fiksi (cerita bersambung) untuk sekolah. Pembaca bisa membaca, menyukai,
menilai, berkomentar, dan menyimpan bacaan. Publisher menulis artikel dan cerita. Admin
memoderasi semuanya. Pemilik project adalah pelajar; jelaskan perubahan dengan bahasa yang
jelas dan jangan berasumsi dia hafal istilah framework.

Baca file ini penuh sebelum mengerjakan tugas apa pun. Kalau aturan di sini bertentangan
dengan instruksi di prompt, instruksi di prompt menang, tapi sebutkan pertentangannya.

---

## 1. Stack dan versi (jangan ditebak)

| Bagian | Yang dipakai |
|---|---|
| Backend | Laravel 13, PHP 8.3, Inertia Laravel 2, Sanctum, Ziggy 2, mews/purifier |
| Frontend | React 18, TypeScript (strict), Inertia React 2, Vite 6 |
| CSS | **Tailwind 3.4** + `@tailwindcss/forms` + `@tailwindcss/typography` |
| Editor | CKEditor 5 (classic build 41) |
| Database | SQLite di `.env.example`; produksi/lokal Laragon memakai MySQL (`pendigi_db`) |
| Queue/cache/session | driver `database` |

Catatan penting:
- `@tailwindcss/vite` v4 ikut terpasang tapi **tidak dipakai**. Proyek ini Tailwind 3. Jangan
  memakai utilitas khas v4 (contoh: `shadow-xs`, `rounded-xs`, sintaks `@import "tailwindcss"`);
  utilitas itu tidak menghasilkan apa pun di v3.
- Alias import: `@/` → `resources/js/`. Fungsi `route()` (Ziggy) tersedia global.
- Tidak ada folder `tests/` saat ini. Jangan mengarang hasil tes.

## 2. Perintah

```bash
composer run dev          # server + queue + log + vite sekaligus
npm run dev               # vite saja
npm run build             # tsc && vite build  (WAJIB lolos sebelum menyatakan selesai)
php artisan migrate       # jalankan migrasi baru
php artisan db:seed       # buat admin (ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD di .env)
php artisan storage:link  # agar /storage/... bisa diakses
php artisan route:list    # cek route sebelum/ sesudah mengubah web.php
./vendor/bin/pint         # format PHP
```

`public/build` di-upload ke hosting. Setiap perubahan di `resources/js` atau CSS baru terlihat
di produksi setelah `npm run build`. Ingatkan pemilik untuk build ulang bila perlu.

**Jangan** menjalankan tanpa persetujuan eksplisit: `migrate:fresh`, `migrate:rollback`,
`db:wipe`, `rm -rf`, `git reset --hard`, `git push`, `composer update`, `npm update`.
Jangan menambah dependency baru tanpa bertanya dan menjelaskan alasannya.

## 3. Cara kerja

1. **Baca dulu.** Buka file yang terkait (controller, model, halaman, route) sebelum mengubah.
   Jangan menebak nama kolom, nama route, atau nama prop; cek di kode atau migrasi.
2. **Rencana singkat.** Untuk perubahan yang menyentuh lebih dari 3 file, tulis dulu 3–6 poin
   apa yang akan diubah, lalu kerjakan setelah ada persetujuan.
3. **Diff sekecil mungkin.** Kerjakan yang diminta. Jangan merapikan, mengganti nama, atau
   memindahkan file lain yang tidak diminta. Kalau menemukan masalah lain, laporkan di akhir,
   jangan diperbaiki diam-diam.
4. **Ikuti pola yang sudah ada** (bagian 4–6) daripada memperkenalkan pola baru.
5. **Verifikasi.** Jalankan `npm run build` untuk perubahan frontend, `php artisan route:list`
   untuk perubahan route, dan baca ulang diff. Kalau tidak bisa menjalankan sesuatu, katakan
   dengan jelas; jangan menyatakan "sudah dites" bila belum.
6. **Laporan akhir** singkat: apa yang diubah (per file), apa yang perlu dijalankan pemilik
   (migrate, build, storage:link), dan hal yang sengaja tidak disentuh.

Jangan membuat file dokumentasi, catatan, atau README baru kecuali diminta.
Jangan menyentuh: `.env`, `vendor/`, `node_modules/`, `public/build/`, `storage/`,
`bootstrap/cache/`, `database/database.sqlite`, lockfile (kecuali dependency memang berubah).

## 4. Konvensi backend

### Penamaan
- Tabel, kolom, model, route, dan variabel berbahasa Indonesia: `artikel`, `cerita`, `bab`,
  `komentar`, `kategori`, `penulis`, `judul_artikel`, `catatan_admin`, dst.
- Primary key custom, bukan `id`: `user_id`, `artikel_id`, `cerita_id`, `bab_id`, `komentar_id`,
  `kategori_id`, `banner_id`, `pengajuan_id`, `bookmark_id`, `riwayat_id`, `nis_id`,
  `rating_id`, `rating_cerita_id`, `like_cerita_id`. **Tabel `likes` memakai `sukai_id`.**
- Setiap model wajib menulis `$table`, `$primaryKey`, `$fillable`, dan memberi key eksplisit
  pada relasi, contoh: `belongsTo(User::class, 'user_id', 'user_id')`.
- `komentar` hanya punya `create_at` (bukan `created_at`) dan tidak punya `updated_at`;
  model sudah mengatur `CREATED_AT = 'create_at'`, `UPDATED_AT = null`. Urutkan dengan `create_at`.
- Komentar milik **artikel atau bab** (`artikel_id` atau `bab_id`, salah satu null) dan bisa
  punya `parent_id` untuk balasan.

### Role dan status
- Role (`users.role`): `admin`, `publisher`, `reader`. Daftar baru otomatis `reader`.
  Reader naik jadi publisher lewat `pengajuan_publisher` yang disetujui admin.
- Status konten (`artikel`, `cerita`, `bab`): `draft` → `pending_review` → `published` atau
  `rejected`. Status komentar: `pending` → `approved` / `rejected`.
- Hanya konten `published` yang boleh tampil publik. Query publik memakai scope `published()`
  atau `where('status','published')`; komentar memakai scope `approved()`.
- Setiap kali publisher menyimpan perubahan, status kembali ke `draft` atau `pending_review`
  (sesuai `aksi`). Ini kebijakan moderasi; jangan dilonggarkan tanpa diminta.
- Keputusan admin (approve/reject) wajib memanggil `KeputusanModerasi` agar penulis dapat
  notifikasi lonceng. Jika menambah jenis konten baru yang dimoderasi, tambahkan factory
  method di notifikasi dan teksnya di `Components/Lonceng.tsx`.
- Route admin: `middleware(['auth','role:admin'])`; publisher: `['auth','role:publisher']`.
  Di dalam controller publisher, selalu `abort_unless($model->user_id === $request->user()->user_id, 403)`
  (untuk bab: lewat `$bab->cerita->user_id`).

### Controller dan validasi
- Controller tipis, validasi inline dengan `$request->validate([...])`. Pesan error kustom
  dalam bahasa Indonesia bila pesan bawaan membingungkan.
- Respons: `Inertia::render('Folder/Halaman', [...])` atau `redirect()` dengan
  `->with('success', '...')` / `->with('error', '...')` (flash dibagikan lewat
  `HandleInertiaRequests`). Pesan flash berbahasa Indonesia, kalimat lengkap, tanpa tanda seru.
- Aksi interaksi publik (like, rating, komentar, bookmark) wajib mengecek konten `published`
  (`abort_unless(... 'published', 404)`), termasuk balasan komentar.
- Eager load dengan kolom terbatas untuk data publik, contoh `penulis:user_id,nama_lengkap,foto_profil`.
  **Jangan pernah** mengirim `email`, `nis`, atau `password` user lain ke halaman publik atau
  ke props halaman selain admin.
- Paginasi memakai `->paginate(n)->withQueryString()` dan urutan stabil
  (tambahkan `->orderByDesc('xxx_id')` sebagai penentu akhir).
- Query pengelompokan tanggal dilakukan di PHP, bukan `DATE_FORMAT`, agar jalan di MySQL dan SQLite.

### Migrasi
- Nama file: `YYYY_MM_DD_NNNNNN_deskripsi.php`, kelas anonim.
- Tulis defensif: bungkus dengan `Schema::hasTable` / `Schema::hasColumn` (database produksi
  kadang diubah manual lewat SQL).
- Kolom PK: `$table->id('nama_id')`; foreign key eksplisit
  `->constrained('tabel', 'kolom_id')->onDelete(...)`. Tambahkan `unique` untuk pasangan
  yang tidak boleh ganda (contoh `[user_id, artikel_id]`).
- Selalu isi `down()`. Jangan mengubah migrasi lama yang sudah dijalankan; buat migrasi baru.

### Keamanan (tidak bisa ditawar)
- Semua HTML dari CKEditor (isi artikel, isi bab) **wajib** lewat
  `App\Support\KontenBersih::bersihkan()` sebelum disimpan. Jangan menyimpan HTML mentah dan
  jangan membuat jalur lain yang melewati sanitasi. Video hanya YouTube (ID 11 karakter).
- `dangerouslySetInnerHTML` hanya untuk konten yang sudah disanitasi server, dan lewat
  `embedVideo()` bila memuat video. Teks dari user lain (komentar, nama, sinopsis) dirender
  sebagai teks biasa.
- Upload: validasi `image` + `mimes` + `max` (2048 KB umumnya), simpan ke disk `public` di folder
  yang sudah ada (`artikel`, `cerita`, `avatar`, `banner`, `konten`, `portofolio`). Hapus file
  lama saat diganti dan saat record dihapus (cegah file yatim).
- Jangan menaruh rahasia di kode. Jangan membaca atau mencetak `.env`.
- Tindakan merusak (hapus, ubah role) butuh konfirmasi di UI dan pengecekan di server
  (admin tidak boleh mengubah/menghapus akun sendiri).

## 5. Konvensi frontend

- Satu halaman = satu file `resources/js/Pages/<Folder>/<Nama>.tsx`, `export default`.
  Nama komponen di `Inertia::render()` harus sama persis dengan path file (huruf besar-kecil
  berpengaruh; `app.blade.php` memuat file halaman berdasarkan nama itu).
- Halaman yang butuh login memakai `AuthenticatedLayout`; halaman auth memakai `GuestLayout`;
  halaman publik membuat header sendiri (lihat `Home.tsx`). Jika menyentuh header publik,
  pertimbangkan mengekstraknya jadi satu komponen, tapi hanya bila diminta.
- Form: `useForm` dari `@inertiajs/react`. Pola yang sudah dipakai dan harus dipertahankan:
  - Tombol "draft" dan "kirim untuk ditinjau" memakai `transform(d => ({...d, aksi}))` lalu `post/put`.
  - Form dengan upload file memakai `post` + `forceFormData: true` + `_method: 'put'` untuk update.
- Navigasi dan aksi: `router.get/post/put/delete`, tautan dengan `<Link>`. URL selalu lewat
  `route('nama.route', param)`; jangan menulis path manual. Pastikan nama route benar-benar
  ada di `routes/web.php`.
- TypeScript strict: tidak ada `any`; definisikan `interface` untuk props. Tipe bersama di
  `resources/js/types`.
- Tanggal ditampilkan dengan `toLocaleDateString('id-ID', ...)`. Angka dengan `toLocaleString('id-ID')`.
- Gambar dari storage: `/storage/${path}`. Selalu beri `alt`. Pakai `Avatar` untuk foto profil.
- Gunakan komponen bersama di `Components/PendigiUI.tsx` (`Panel`, `Field`, `Button`, `Notice`,
  token warna). **Jangan** mendefinisikan ulang konstanta seperti `clipPanel`, `ACCENT`, `BORDER`
  di file halaman baru. Jika file lama sudah menduplikasinya, jangan dibersihkan kecuali
  memang bagian dari tugas.
- Aksesibilitas dasar: `<button type="button">` untuk aksi non-submit, `aria-label` pada tombol
  ikon, fokus terlihat, kontras teks cukup.
- Hormati `prefers-reduced-motion` bila menambah animasi.

## 6. Desain

### Arah
Pendigi harus terasa seperti **media/portal artikel yang rapi**, bukan dashboard template dan
bukan antarmuka bertema game. Minimalis, tenang, mudah dibaca. Pemilik sedang memigrasikan
tampilan dari gaya terminal lama ke gaya baru ini, dimulai dari dashboard admin. Bila prompt
menyertakan sampel HTML yang sudah disetujui, **itu sumber kebenaran**: tiru, jangan
berimprovisasi.

### Aturan keras
- **Hanya tema terang.** Tidak ada dark mode, tidak ada `dark:` class.
- **Navigasi di atas**, bukan sidebar.
- **Warna solid, tanpa gradient** (tidak di latar, tombol, garis, maupun overlay gambar).
  Satu warna aksen (saat ini `#a8265c`), sisanya netral hangat. Jangan polos total:
  gunakan aksen untuk tautan, status penting, dan satu elemen fokus per layar.
- **Tanpa emoji** di UI, termasuk karakter simbol dekoratif sebagai ikon (mata, klip, hati,
  bintang). Gunakan teks atau SVG garis sederhana. (Bintang rating boleh tetap sebagai
  kontrol, tampilkan dengan SVG.)
- **Font:** hanya yang ditentukan di `tailwind.config.js` / `app.blade.php`. Jangan
  menambah font baru sendiri. Jangan memakai Newsreader, Georgia, Inter, atau Source Serif.
  Hierarki dibangun dari ukuran, bobot, dan jarak, bukan dari banyak font.
- Gaya terminal lama (potongan sudut `clip-path`, label `// SEPERTI INI`, huruf mono kapital
  di mana-mana, latar grid) **jangan dipakai di halaman baru atau yang sedang didesain ulang**.
  Di halaman yang tidak sedang dikerjakan, biarkan apa adanya.

### Hindari ciri "buatan AI"
- Semua kartu `rounded-xl` + bayangan lembut + border tipis yang seragam.
- Badge pil berwarna-warni, ikon di dalam lingkaran berwarna, deretan statistik besar dengan
  label kecil huruf kapital.
- Hero berlebihan, judul bergaya "Selamat datang di...", subjudul promosi, kalimat pengisi.
- Animasi hover/transisi di semua elemen, efek kaca (blur), glow.
- Grid tiga kolom kartu identik untuk segala hal; variasikan susunan sesuai isi
  (daftar rapat untuk data, kartu besar hanya untuk konten editorial).
- Teks pengganti (lorem, "Nama Pengguna", angka karangan) yang lolos ke kode.

### Yang diinginkan
- Tata letak berbasis kolom dan garis tipis, jarak lega dan konsisten (skala 4/8 px), lebar baca
  nyaman (±65–75 karakter untuk teks artikel/bab).
- Judul jelas dan padat; metadata (penulis, tanggal, kategori) kecil dan tenang.
- Tabel dan daftar untuk data admin: rapat, terbaca, status ditandai dengan teks + warna
  lembut, bukan hanya warna.
- Keadaan kosong, memuat, dan error selalu dirancang (kalimat singkat + tindakan berikutnya).
- Responsif: periksa lebar ±360 px, 768 px, dan 1280 px. Tidak ada scroll horizontal pada halaman.
- Konten editor (`.prose`, `.prose-pendigi`) harus tetap terbaca: gambar, tabel, kutipan, video.

### Teks antarmuka
Bahasa Indonesia, singkat, lugas, sopan. Gunakan huruf kapital biasa (bukan SEMUA KAPITAL)
untuk teks baru. Tombol berupa kata kerja ("Kirim untuk ditinjau", "Simpan draft"). Pesan error
menjelaskan apa yang salah dan cara memperbaikinya. Tidak ada tanda seru berlebihan.

## 7. Kualitas kode

- Tulis kode yang membosankan dan jelas. Jangan membuat abstraksi, hook, atau helper untuk
  satu pemakaian.
- Komentar hanya untuk menjelaskan **alasan**, dalam bahasa Indonesia (sesuai kode yang ada).
  Jangan menulis komentar yang mengulang isi baris.
- Hapus import dan variabel yang tidak terpakai pada kode yang kamu ubah.
- Jangan membiarkan `console.log`, `dd()`, atau kode percobaan.
- Format PHP mengikuti Pint; format TS mengikuti gaya file di sekitarnya (indentasi 4 spasi,
  tanda kutip tunggal, titik koma).

## 8. Masalah yang sudah diketahui (jangan diperbaiki kecuali diminta)

Diketahui dari audit kode; bila tugasmu menyentuh area ini, sebutkan di laporan:
1. Route `admin.users.reset` menunjuk `UserController::resetPassword` yang belum ada.
2. Fitur Daftar NIS (controller, model, halaman) belum punya route dan Register tidak meminta NIS.
3. Like/rating/komentar artikel belum mengecek status `published`; `ratingCerita` juga belum.
   Tabel `likes` belum punya unique `(artikel_id, user_id)`.
4. Menyimpan info cerita yang sudah tayang mengembalikannya ke draft/pending (cerita hilang dari publik).
5. `min:50` pada `isi_artikel` menghitung HTML, bukan teks bersih.
6. Teks konfirmasi hapus kategori menyebut "beserta seluruh artikel", padahal server menolak.
7. Hapus user/akun tidak menghapus file miliknya di storage.
8. Timezone aplikasi masih `UTC` dan locale `en`.
9. File tak terpakai: `Pages/Welcome.tsx`, `Pages/Reader/Dashboard.tsx`,
   `Publisher\CeritaController::index`.
10. `Admin/Dashboard.tsx` memakai `shadow-xs` (tidak berlaku di Tailwind 3).

## 9. Definisi selesai

- [ ] Sesuai permintaan, tanpa perubahan di luar lingkup.
- [ ] `npm run build` lolos (untuk perubahan frontend); route valid (untuk perubahan route).
- [ ] Aturan keamanan bagian 4 tetap terpenuhi (sanitasi, kepemilikan, status published, data privat).
- [ ] Tidak ada emoji, gradient, atau font terlarang di UI yang kamu tulis.
- [ ] Laporan akhir menyebut: file yang berubah, perintah yang perlu dijalankan pemilik,
      dan hal yang tidak diuji atau tidak disentuh.
