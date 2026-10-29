<?php

use App\Http\Controllers\Admin\PengajuanController;
use App\Http\Controllers\CeritaController as CeritaPublikController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PengajuanPublisherController;
use App\Http\Controllers\Publisher\UploadGambarController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PustakaController;
use App\Http\Controllers\Publisher\ArtikelController;
use App\Http\Controllers\Publisher\BabController;
use App\Http\Controllers\Publisher\CeritaController as PublisherCeritaController;
use App\Http\Controllers\InteraksiController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ModerasiController;
use App\Http\Controllers\ArtikelController as ArtikelPublikController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Satu route dashboard, tapi tampilannya beda-beda tergantung role (lihat DashboardController)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/foto', [ProfileController::class, 'updateFoto'])->name('profile.foto');
    Route::delete('/profile/foto', [ProfileController::class, 'destroyFoto'])->name('profile.foto.destroy');
    Route::post('/profile/pengajuan-publisher', [PengajuanPublisherController::class, 'store'])->name('profile.pengajuan');
});

Route::get('/artikel/{artikel:artikel_id}', [ArtikelPublikController::class, 'show'])->name('artikel.show');

Route::middleware('auth')->group(function () {
    Route::post('/artikel/{artikel}/like', [InteraksiController::class, 'like'])->name('artikel.like');
    Route::post('/artikel/{artikel}/rating', [InteraksiController::class, 'rating'])->name('artikel.rating');
    Route::post('/artikel/{artikel}/komentar', [InteraksiController::class, 'komentar'])->name('artikel.komentar');
    Route::post('/komentar/{komentar}/balas', [InteraksiController::class, 'balasKomentar'])->name('komentar.balas');

    // Notifikasi (ikon lonceng)
    Route::post('/notifikasi/baca-semua', [NotifikasiController::class, 'bacaSemua'])->name('notifikasi.baca-semua');
    Route::get('/notifikasi/{id}', [NotifikasiController::class, 'buka'])->name('notifikasi.buka');

    // Pustaka Saya: bookmark dan riwayat baca
    Route::get('/pustaka', [PustakaController::class, 'index'])->name('pustaka.index');
    Route::post('/artikel/{artikel}/bookmark', [PustakaController::class, 'bookmarkArtikel'])->name('artikel.bookmark');
    Route::post('/cerita/{cerita}/bookmark', [PustakaController::class, 'bookmarkCerita'])->name('cerita.bookmark');
    Route::delete('/pustaka/riwayat', [PustakaController::class, 'kosongkanRiwayat'])->name('pustaka.riwayat.kosongkan');
    Route::delete('/pustaka/riwayat/{riwayat}', [PustakaController::class, 'hapusRiwayat'])->name('pustaka.riwayat.hapus');
});

// Cerita (publik, siapa saja bisa baca)
Route::get('/cerita', [CeritaPublikController::class, 'index'])->name('cerita.index');
Route::get('/cerita/{cerita:cerita_id}', [CeritaPublikController::class, 'show'])->name('cerita.show');
Route::get('/cerita/{cerita:cerita_id}/baca/{bab}', [CeritaPublikController::class, 'baca'])->name('cerita.baca');

Route::middleware('auth')->group(function () {
    Route::post('/cerita/{cerita}/rating', [InteraksiController::class, 'ratingCerita'])->name('cerita.rating');
    Route::post('/cerita/{cerita}/like', [InteraksiController::class, 'likeCerita'])->name('cerita.like');
    Route::post('/bab/{bab}/komentar', [InteraksiController::class, 'komentarBab'])->name('bab.komentar');
});

// Khusus Admin
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/kategori', [KategoriController::class, 'index'])->name('kategori.index');
    Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
    Route::put('/kategori/{kategori}', [KategoriController::class, 'update'])->name('kategori.update');
    Route::delete('/kategori/{kategori}', [KategoriController::class, 'destroy'])->name('kategori.destroy');
    Route::get('/pengajuan-publisher', [PengajuanController::class, 'index'])->name('pengajuan.index');
    Route::put('/pengajuan-publisher/{pengajuan}/approve', [PengajuanController::class, 'approve'])->name('pengajuan.approve');
    Route::put('/pengajuan-publisher/{pengajuan}/reject', [PengajuanController::class, 'reject'])->name('pengajuan.reject');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::put('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
    Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/moderasi-artikel', [ModerasiController::class, 'artikel'])->name('moderasi.artikel');
    Route::put('/moderasi-artikel/{artikel}/approve', [ModerasiController::class, 'approveArtikel'])->name('moderasi.artikel.approve');
    Route::put('/moderasi-artikel/{artikel}/reject', [ModerasiController::class, 'rejectArtikel'])->name('moderasi.artikel.reject');

    Route::get('/moderasi-komentar', [ModerasiController::class, 'komentar'])->name('moderasi.komentar');
    Route::get('/moderasi-komentar/riwayat', [ModerasiController::class, 'riwayatKomentar'])->name('moderasi.komentar.riwayat');
    Route::put('/moderasi-komentar/{komentar}/approve', [ModerasiController::class, 'approveKomentar'])->name('moderasi.komentar.approve');
    Route::put('/moderasi-komentar/{komentar}/reject', [ModerasiController::class, 'rejectKomentar'])->name('moderasi.komentar.reject');

    Route::get('/moderasi-cerita', [ModerasiController::class, 'cerita'])->name('moderasi.cerita');
    Route::put('/moderasi-cerita/{cerita}/approve', [ModerasiController::class, 'approveCerita'])->name('moderasi.cerita.approve');
    Route::put('/moderasi-cerita/{cerita}/reject', [ModerasiController::class, 'rejectCerita'])->name('moderasi.cerita.reject');

    Route::get('/moderasi-bab', [ModerasiController::class, 'bab'])->name('moderasi.bab');
    Route::put('/moderasi-bab/{bab}/approve', [ModerasiController::class, 'approveBab'])->name('moderasi.bab.approve');
    Route::put('/moderasi-bab/{bab}/reject', [ModerasiController::class, 'rejectBab'])->name('moderasi.bab.reject');

    Route::get('/banner', [BannerController::class, 'index'])->name('banner.index');
    Route::post('/banner', [BannerController::class, 'store'])->name('banner.store');
    Route::put('/banner/{banner}', [BannerController::class, 'update'])->name('banner.update');
    Route::delete('/banner/{banner}', [BannerController::class, 'destroy'])->name('banner.destroy');

});

// Khusus Publisher
Route::middleware(['auth', 'role:publisher'])->prefix('publisher')->name('publisher.')->group(function () {
    Route::post('/upload-gambar', [UploadGambarController::class, 'store'])->name('upload.gambar');
    Route::get('/artikel/buat', [ArtikelController::class, 'create'])->name('artikel.create');
    Route::post('/artikel', [ArtikelController::class, 'store'])->name('artikel.store');
    Route::get('/artikel/{artikel}/edit', [ArtikelController::class, 'edit'])->name('artikel.edit');
    Route::put('/artikel/{artikel}', [ArtikelController::class, 'update'])->name('artikel.update');
    Route::delete('/artikel/{artikel}', [ArtikelController::class, 'destroy'])->name('artikel.destroy');

    Route::get('/cerita/buat', [PublisherCeritaController::class, 'create'])->name('cerita.create');
    Route::post('/cerita', [PublisherCeritaController::class, 'store'])->name('cerita.store');
    Route::get('/cerita/{cerita}', [PublisherCeritaController::class, 'kelola'])->name('cerita.kelola');
    Route::get('/cerita/{cerita}/edit', [PublisherCeritaController::class, 'edit'])->name('cerita.edit');
    Route::put('/cerita/{cerita}', [PublisherCeritaController::class, 'update'])->name('cerita.update');
    Route::put('/cerita/{cerita}/toggle-progres', [PublisherCeritaController::class, 'toggleProgres'])->name('cerita.toggleProgres');
    Route::delete('/cerita/{cerita}', [PublisherCeritaController::class, 'destroy'])->name('cerita.destroy');

    Route::get('/cerita/{cerita}/bab/buat', [BabController::class, 'create'])->name('bab.create');
    Route::post('/cerita/{cerita}/bab', [BabController::class, 'store'])->name('bab.store');
    Route::get('/bab/{bab}/edit', [BabController::class, 'edit'])->name('bab.edit');
    Route::put('/bab/{bab}', [BabController::class, 'update'])->name('bab.update');
    Route::delete('/bab/{bab}', [BabController::class, 'destroy'])->name('bab.destroy');
});

require __DIR__.'/auth.php';