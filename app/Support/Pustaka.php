<?php

namespace App\Support;

use App\Models\Artikel;
use App\Models\Bab;
use App\Models\Bookmark;
use App\Models\Cerita;
use App\Models\RiwayatBaca;
use Illuminate\Support\Collection;

/**
 * Logika "Pustaka Saya": mencatat riwayat baca otomatis dan menyusun daftar riwayat/bookmark
 * dalam bentuk seragam (artikel dan cerita dicampur) untuk halaman Pustaka dan Beranda.
 */
class Pustaka
{
    // Riwayat per user dibatasi supaya tabel tidak membengkak; yang paling lama dibuang.
    public const BATAS_RIWAYAT = 30;

    public static function catatArtikel(int $userId, Artikel $artikel): void
    {
        self::simpan(['user_id' => $userId, 'artikel_id' => $artikel->artikel_id], null);
    }

    public static function catatBab(int $userId, Cerita $cerita, Bab $bab): void
    {
        self::simpan(['user_id' => $userId, 'cerita_id' => $cerita->cerita_id], $bab->bab_id);
    }

    private static function simpan(array $kunci, ?int $babId): void
    {
        // Ditimpa, bukan ditambah: satu baris per konten per user.
        $riwayat = RiwayatBaca::updateOrCreate($kunci, ['bab_id' => $babId]);

        if ($riwayat->wasRecentlyCreated) {
            self::pangkas($kunci['user_id']);
        } else {
            $riwayat->touch(); // updateOrCreate tidak menyentuh updated_at kalau tidak ada yang berubah
        }
    }

    private static function pangkas(int $userId): void
    {
        $lebih = RiwayatBaca::where('user_id', $userId)
            ->orderByDesc('updated_at')
            ->orderByDesc('riwayat_id')
            ->skip(self::BATAS_RIWAYAT)
            ->take(PHP_INT_MAX)
            ->pluck('riwayat_id');

        if ($lebih->isNotEmpty()) {
            RiwayatBaca::whereIn('riwayat_id', $lebih)->delete();
        }
    }

    /**
     * Daftar "Lanjut Baca" terbaru. Konten yang sudah dihapus atau tidak lagi published disaring.
     */
    public static function riwayat(int $userId, ?int $batas = null): Collection
    {
        $daftar = RiwayatBaca::where('user_id', $userId)
            ->with([
                'artikel:artikel_id,judul_artikel,gambar,status',
                'cerita:cerita_id,judul_cerita,sampul,status',
                'bab:bab_id,cerita_id,nomor_bab,judul_bab,status',
            ])
            ->orderByDesc('updated_at')
            ->orderByDesc('riwayat_id')
            ->get()
            ->map(function (RiwayatBaca $r) {
                if ($r->artikel) {
                    if ($r->artikel->status !== 'published') {
                        return null;
                    }

                    return [
                        'riwayat_id' => $r->riwayat_id,
                        'jenis' => 'artikel',
                        'id' => $r->artikel->artikel_id,
                        'judul' => $r->artikel->judul_artikel,
                        'gambar' => $r->artikel->gambar,
                        'bab' => null,
                        'waktu' => $r->updated_at,
                    ];
                }

                if (! $r->cerita || $r->cerita->status !== 'published') {
                    return null;
                }

                // Bab terakhir hanya dipakai kalau masih published; kalau tidak, pembaca diarahkan ke halaman cerita.
                $bab = $r->bab && $r->bab->status === 'published' ? $r->bab : null;

                return [
                    'riwayat_id' => $r->riwayat_id,
                    'jenis' => 'cerita',
                    'id' => $r->cerita->cerita_id,
                    'judul' => $r->cerita->judul_cerita,
                    'gambar' => $r->cerita->sampul,
                    'bab' => $bab ? [
                        'bab_id' => $bab->bab_id,
                        'nomor_bab' => $bab->nomor_bab,
                        'judul_bab' => $bab->judul_bab,
                    ] : null,
                    'waktu' => $r->updated_at,
                ];
            })
            ->filter()
            ->values();

        return $batas ? $daftar->take($batas)->values() : $daftar;
    }

    public static function bookmark(int $userId): Collection
    {
        return Bookmark::where('user_id', $userId)
            ->with([
                'artikel:artikel_id,judul_artikel,gambar,status',
                'cerita:cerita_id,judul_cerita,sampul,status',
            ])
            ->latest('created_at')
            ->get()
            ->map(function (Bookmark $b) {
                if ($b->artikel && $b->artikel->status === 'published') {
                    return [
                        'bookmark_id' => $b->bookmark_id,
                        'jenis' => 'artikel',
                        'id' => $b->artikel->artikel_id,
                        'judul' => $b->artikel->judul_artikel,
                        'gambar' => $b->artikel->gambar,
                        'waktu' => $b->created_at,
                    ];
                }

                if ($b->cerita && $b->cerita->status === 'published') {
                    return [
                        'bookmark_id' => $b->bookmark_id,
                        'jenis' => 'cerita',
                        'id' => $b->cerita->cerita_id,
                        'judul' => $b->cerita->judul_cerita,
                        'gambar' => $b->cerita->sampul,
                        'waktu' => $b->created_at,
                    ];
                }

                return null;
            })
            ->filter()
            ->values();
    }
}
