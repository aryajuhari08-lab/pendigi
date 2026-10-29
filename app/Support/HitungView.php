<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Menghitung views sekali per sesi per konten. Tanpa ini, setiap kali halaman dimuat ulang
 * (atau memberi like/rating yang me-redirect kembali ke halaman yang sama) angka views ikut bertambah.
 *
 * Catatan: ini "per sesi browser", bukan "per orang". Pembaca yang menutup browser lalu kembali
 * dihitung lagi, dan tamu tanpa cookie tidak bisa dibedakan. Itu cukup untuk membuang lonjakan palsu
 * akibat refresh tanpa perlu menyimpan jejak tiap pembaca di database.
 */
class HitungView
{
    // Daftar id per jenis dibatasi supaya data sesi tidak membengkak bagi pembaca yang sangat aktif.
    private const BATAS = 200;

    /** true kalau konten ini baru pertama kali dilihat di sesi ini (dan sekarang dicatat). */
    public static function pertamaKali(Request $request, string $jenis, int $id): bool
    {
        $kunci = "dilihat.{$jenis}";
        $daftar = $request->session()->get($kunci, []);

        if (in_array($id, $daftar, true)) {
            return false;
        }

        $daftar[] = $id;
        $request->session()->put($kunci, array_slice($daftar, -self::BATAS));

        return true;
    }
}
