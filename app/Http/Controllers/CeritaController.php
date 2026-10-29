<?php

namespace App\Http\Controllers;

use App\Models\Bab;
use App\Models\Bookmark;
use App\Models\Cerita;
use App\Models\RiwayatBaca;
use App\Support\HitungView;
use App\Support\Pustaka;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CeritaController extends Controller
{
    public function index(Request $request): Response
    {
        $cerita = Cerita::published()
            ->with('penulis:user_id,nama_lengkap,foto_profil')
            ->withCount(['babPublished as jumlah_bab'])
            ->when($request->search, function ($query, $search) {
                $query->where('judul_cerita', 'like', "%{$search}%");
            })
            ->when($request->genre, function ($query, $genre) {
                $query->where('genre', $genre);
            })
            ->latest()
            ->orderByDesc('cerita_id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Cerita/Index', [
            'cerita' => $cerita,
            'filters' => $request->only('search', 'genre'),
        ]);
    }

    public function show(Cerita $cerita): Response
    {
        abort_unless($cerita->status === 'published', 404);

        // 1 view per sesi per cerita (rating/like me-reload halaman ini lewat redirect back)
        if (HitungView::pertamaKali(request(), 'cerita', (int) $cerita->cerita_id)) {
            $cerita->increment('views');
        }

        $userId = request()->user()?->user_id;

        // Bab terakhir yang dibaca user ini (kalau masih published), untuk tombol "Lanjut Membaca".
        $babTerakhir = null;
        if ($userId) {
            $riwayat = RiwayatBaca::with('bab:bab_id,cerita_id,nomor_bab,status')
                ->where('user_id', $userId)
                ->where('cerita_id', $cerita->cerita_id)
                ->first();

            if ($riwayat?->bab && $riwayat->bab->status === 'published') {
                $babTerakhir = ['bab_id' => $riwayat->bab->bab_id, 'nomor_bab' => $riwayat->bab->nomor_bab];
            }
        }

        return Inertia::render('Cerita/Show', [
            'cerita' => $cerita->load('penulis:user_id,nama_lengkap,foto_profil'),
            'bab' => $cerita->babPublished()->get(['bab_id', 'nomor_bab', 'judul_bab', 'views', 'created_at']),
            'ratingAvg' => round((float) $cerita->rataRating(), 1),
            'ratingCount' => $cerita->ratingCerita()->count(),
            'likesCount' => $cerita->likeCerita()->count(),
            'sudahLike' => $userId ? $cerita->likeCerita()->where('user_id', $userId)->exists() : false,
            'babTerakhir' => $babTerakhir,
            'sudahBookmark' => $userId
                ? Bookmark::where('user_id', $userId)->where('cerita_id', $cerita->cerita_id)->exists()
                : false,
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

        if (HitungView::pertamaKali(request(), 'bab', (int) $bab->bab_id)) {
            $bab->increment('views');
        }

        $babSebelum = $cerita->babPublished()->where('nomor_bab', '<', $bab->nomor_bab)->orderByDesc('nomor_bab')->first(['bab_id', 'nomor_bab']);
        $babSesudah = $cerita->babPublished()->where('nomor_bab', '>', $bab->nomor_bab)->orderBy('nomor_bab')->first(['bab_id', 'nomor_bab']);

        $userId = request()->user()?->user_id;

        // Pembaca yang login: catat bab ini sebagai posisi terakhir di cerita tersebut.
        if ($userId) {
            Pustaka::catatBab($userId, $cerita, $bab);
        }

        // Komentar induk yang sudah disetujui + balasannya yang juga sudah disetujui
        $komentar = $bab->komentar()
            ->approved()
            ->whereNull('parent_id')
            ->with([
                'penulis:user_id,nama_lengkap,foto_profil',
                'balasan' => fn ($q) => $q->approved()
                    ->orderBy('create_at')
                    ->with('penulis:user_id,nama_lengkap,foto_profil'),
            ])
            ->latest('create_at')
            ->get();

        return Inertia::render('Cerita/Baca', [
            'cerita' => $cerita->only(['cerita_id', 'judul_cerita', 'sampul']),
            'penulis' => $cerita->penulis->only(['nama_lengkap', 'foto_profil']),
            'bab' => $bab,
            'komentar' => $komentar,
            'likesCount' => $cerita->likeCerita()->count(),
            'sudahLike' => $userId ? $cerita->likeCerita()->where('user_id', $userId)->exists() : false,
            'sudahBookmark' => $userId
                ? Bookmark::where('user_id', $userId)->where('cerita_id', $cerita->cerita_id)->exists()
                : false,
            'ratingAvg' => round((float) $cerita->rataRating(), 1),
            'ratingCount' => $cerita->ratingCerita()->count(),
            'ratingSaya' => $userId ? $cerita->ratingCerita()->where('user_id', $userId)->value('skor') : null,
            'isPenulis' => $userId === $cerita->user_id,
            'babSebelum' => $babSebelum,
            'babSesudah' => $babSesudah,
        ]);
    }
}