<?php

namespace App\Http\Controllers;

use App\Models\Bab;
use App\Models\Cerita;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CeritaController extends Controller
{
    public function index(Request $request): Response
    {
        $cerita = Cerita::published()
            ->with('penulis')
            ->withCount(['babPublished as jumlah_bab'])
            ->when($request->search, function ($query, $search) {
                $query->where('judul_cerita', 'like', "%{$search}%");
            })
            ->when($request->genre, function ($query, $genre) {
                $query->where('genre', $genre);
            })
            ->latest()
            ->get();

        return Inertia::render('Cerita/Index', [
            'cerita' => $cerita,
            'filters' => $request->only('search', 'genre'),
        ]);
    }

    public function show(Cerita $cerita): Response
    {
        abort_unless($cerita->status === 'published', 404);

        $userId = request()->user()?->user_id;

        return Inertia::render('Cerita/Show', [
            'cerita' => $cerita->load('penulis'),
            'bab' => $cerita->babPublished()->get(['bab_id', 'nomor_bab', 'judul_bab', 'views', 'created_at']),
            'ratingAvg' => round((float) $cerita->rataRating(), 1),
            'ratingCount' => $cerita->ratingCerita()->count(),
            'ratingSaya' => $userId
                ? $cerita->ratingCerita()->where('user_id', $userId)->value('skor')
                : null,
        ]);
    }

    public function baca(Cerita $cerita, Bab $bab): Response
    {
        abort_unless($cerita->status === 'published', 404);
        abort_unless($bab->status === 'published', 404);
        abort_unless($bab->cerita_id === $cerita->cerita_id, 404);

        $bab->increment('views');

        $babSebelum = $cerita->babPublished()->where('nomor_bab', '<', $bab->nomor_bab)->orderByDesc('nomor_bab')->first(['bab_id', 'nomor_bab']);
        $babSesudah = $cerita->babPublished()->where('nomor_bab', '>', $bab->nomor_bab)->orderBy('nomor_bab')->first(['bab_id', 'nomor_bab']);

        return Inertia::render('Cerita/Baca', [
            'cerita' => $cerita->only(['cerita_id', 'judul_cerita', 'sampul']),
            'penulis' => $cerita->penulis->only(['nama_lengkap']),
            'bab' => $bab,
            'babSebelum' => $babSebelum,
            'babSesudah' => $babSesudah,
        ]);
    }
}