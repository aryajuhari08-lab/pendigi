<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Bookmark;
use App\Support\HitungView;
use App\Support\Pustaka;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtikelController extends Controller
{
    public function show(Request $request, Artikel $artikel): Response
    {
        abort_unless($artikel->status === 'published', 404);

        if (HitungView::pertamaKali($request, 'artikel', (int) $artikel->artikel_id)) {
            $artikel->increment('views');
        }
        $artikel->load(['penulis:user_id,nama_lengkap,foto_profil', 'kategori']);

        $komentar = $artikel->komentar()
            ->approved()
            ->whereNull('parent_id')
            ->with([
                'penulis:user_id,nama_lengkap,foto_profil',
                // Balasan juga harus sudah disetujui admin, sama seperti komentar induknya.
                // Balasan dari penulis artikel otomatis approved (lihat InteraksiController::balasKomentar).
                'balasan' => fn ($q) => $q->approved()
                    ->orderBy('create_at')
                    ->with('penulis:user_id,nama_lengkap,foto_profil'),
            ])
            ->latest('create_at')
            ->get();

        $userId = $request->user()?->user_id;

        $sudahLike = $userId
            ? $artikel->likes()->where('user_id', $userId)->exists()
            : false;

        $ratingSaya = $userId
            ? $artikel->rating()->where('user_id', $userId)->value('skor')
            : null;

        $isPenulis = $userId && $artikel->user_id === $userId;

        // Pembaca yang login: catat sebagai bacaan terakhir dan cek apakah artikel ini sudah disimpan.
        if ($userId) {
            Pustaka::catatArtikel($userId, $artikel);
        }

        $sudahBookmark = $userId
            ? Bookmark::where('user_id', $userId)->where('artikel_id', $artikel->artikel_id)->exists()
            : false;

        $artikelTerkait = Artikel::published()
            ->where('kategori_id', $artikel->kategori_id)
            ->where('artikel_id', '!=', $artikel->artikel_id)
            ->latest('tanggal_publikasi')
            ->limit(5)
            ->get(['artikel_id', 'judul_artikel', 'gambar']);

        return Inertia::render('Artikel/Show', [
            'artikel' => $artikel,
            'komentar' => $komentar,
            'likesCount' => $artikel->likes()->count(),
            'ratingAvg' => round((float) $artikel->rating()->avg('skor'), 1),
            'ratingCount' => $artikel->rating()->count(),
            'sudahLike' => $sudahLike,
            'ratingSaya' => $ratingSaya,
            'isPenulis' => $isPenulis,
            'sudahBookmark' => $sudahBookmark,
            'artikelTerkait' => $artikelTerkait,
        ]);
    }
}