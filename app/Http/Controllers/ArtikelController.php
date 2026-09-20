<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtikelController extends Controller
{
    public function show(Request $request, Artikel $artikel): Response
    {
        abort_unless($artikel->status === 'published', 404);

        $artikel->increment('views');
        $artikel->load(['penulis', 'kategori']);

        $komentar = $artikel->komentar()
            ->approved()
            ->whereNull('parent_id')
            ->with(['penulis', 'balasan.penulis'])
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
            'artikelTerkait' => $artikelTerkait,
        ]);
    }
}