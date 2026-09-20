<?php

use App\Http\Controllers\Admin\PengajuanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Publisher\ArtikelController;
use App\Http\Controllers\InteraksiController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ModerasiController;
use App\Http\Controllers\Admin\DaftarNisController;
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
});

Route::get('/artikel/{artikel:artikel_id}', [ArtikelPublikController::class, 'show'])->name('artikel.show');

Route::middleware('auth')->group(function () {
    Route::post('/artikel/{artikel}/like', [InteraksiController::class, 'like'])->name('artikel.like');
    Route::post('/artikel/{artikel}/rating', [InteraksiController::class, 'rating'])->name('artikel.rating');
    Route::post('/artikel/{artikel}/komentar', [InteraksiController::class, 'komentar'])->name('artikel.komentar');
    Route::post('/komentar/{komentar}/balas', [InteraksiController::class, 'balasKomentar'])->name('komentar.balas');
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
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/moderasi-artikel', [ModerasiController::class, 'artikel'])->name('moderasi.artikel');
    Route::put('/moderasi-artikel/{artikel}/approve', [ModerasiController::class, 'approveArtikel'])->name('moderasi.artikel.approve');
    Route::put('/moderasi-artikel/{artikel}/reject', [ModerasiController::class, 'rejectArtikel'])->name('moderasi.artikel.reject');

    Route::get('/moderasi-komentar', [ModerasiController::class, 'komentar'])->name('moderasi.komentar');
    Route::put('/moderasi-komentar/{komentar}/approve', [ModerasiController::class, 'approveKomentar'])->name('moderasi.komentar.approve');
    Route::put('/moderasi-komentar/{komentar}/reject', [ModerasiController::class, 'rejectKomentar'])->name('moderasi.komentar.reject');

    Route::get('/banner', [BannerController::class, 'index'])->name('banner.index');
    Route::post('/banner', [BannerController::class, 'store'])->name('banner.store');
    Route::put('/banner/{banner}/toggle', [BannerController::class, 'toggleAktif'])->name('banner.toggle');
    Route::put('/banner/urutan', [BannerController::class, 'updateUrutan'])->name('banner.urutan');
    Route::delete('/banner/{banner}', [BannerController::class, 'destroy'])->name('banner.destroy');

    Route::get('/daftar-nis', [DaftarNisController::class, 'index'])->name('daftarNis.index');
    Route::post('/daftar-nis', [DaftarNisController::class, 'store'])->name('daftarNis.store');
    Route::delete('/daftar-nis/{daftarNis}', [DaftarNisController::class, 'destroy'])->name('daftarNis.destroy');
});

// Khusus Publisher
Route::middleware(['auth', 'role:publisher'])->prefix('publisher')->name('publisher.')->group(function () {
    Route::get('/artikel/buat', [ArtikelController::class, 'create'])->name('artikel.create');
    Route::post('/artikel', [ArtikelController::class, 'store'])->name('artikel.store');
    Route::get('/artikel/{artikel}/edit', [ArtikelController::class, 'edit'])->name('artikel.edit');
    Route::put('/artikel/{artikel}', [ArtikelController::class, 'update'])->name('artikel.update');
    Route::delete('/artikel/{artikel}', [ArtikelController::class, 'destroy'])->name('artikel.destroy');
});

require __DIR__.'/auth.php';