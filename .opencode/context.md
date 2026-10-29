# Pendigi Project Context

## 1. Deskripsi Aplikasi
Pendigi adalah *platform* portal informasi sekolah/edukasi yang memfasilitasi publikasi artikel dan interaksi warga sekolah. Sisa pengembangan saat ini fokus pada penyelesaian 25% tahap akhir project.

## 2. Sistem Multi-Role (Pengguna)
Aplikasi ini memiliki 3 tipe otorisasi/role:
- **Admin:** Memiliki akses penuh. Bertugas melakukan moderasi konten (menyetujui/menolak artikel) dan mengelola *user*.
- **Publisher:** Bertugas menulis, mengedit, dan mengajukan artikel/konten. Konten tidak akan tayang sebelum disetujui Admin.
- **Reader (Siswa):** Pembaca artikel yang wajib mendaftar dan memvalidasi Nomor Induk Siswa (NIS) mereka. Hanya Reader tervalidasi yang bisa berinteraksi.

## 3. Fitur Utama yang Sedang Dikerjakan (Sisa 25%)
- **Sistem Moderasi Konten:** Dashboard Admin untuk melakukan *review* artikel dari Publisher (opsi: *Approve*, *Reject*, *Draft*).
- **Interaksi Artikel:** Fitur Like dan Komentar (*nested* atau linear) pada artikel yang sudah terbit, khusus untuk Reader yang sudah *login*.
