<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Bab;
use App\Models\Cerita;
use App\Models\Kategori;
use App\Models\Komentar;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        return match ($user->role) {
            'admin' => Inertia::render('Admin/Dashboard', $this->statistikAdmin()),
            'publisher' => Inertia::render('Publisher/Dashboard', [
                'artikel' => $user->artikel()->with('kategori')->latest()->get(),
                'cerita' => $user->cerita()->withCount(['bab as jumlah_bab'])->latest()->get(),
            ]),
            default => redirect()->route('home'),
        };
    }

    private function statistikAdmin(): array
    {
        $artikelPerKategori = Kategori::withCount(['artikel' => function ($q) {
            $q->where('status', 'published');
        }])->get(['kategori_id', 'nama_kategori'])
            ->map(fn ($k) => ['nama' => $k->nama_kategori, 'jumlah' => $k->artikel_count])
            ->sortByDesc('jumlah')
            ->values();

        $userPerRole = User::select('role', DB::raw('count(*) as jumlah'))
            ->groupBy('role')
            ->pluck('jumlah', 'role');

        $mulai = now()->startOfMonth()->subMonths(5);

        // Dikelompokkan di PHP (bukan DATE_FORMAT) supaya jalan di MySQL maupun SQLite,
        // lalu bulan tanpa data diisi 0 supaya grafik selalu menampilkan 6 bulan penuh.
        $artikelPerBulan = $this->isiEnamBulan(
            Artikel::where('status', 'published')
                ->where('tanggal_publikasi', '>=', $mulai)
                ->pluck('tanggal_publikasi')
                ->countBy(fn ($t) => $t->format('Y-m'))
        );

        $userBaruPerBulan = $this->isiEnamBulan(
            User::where('created_at', '>=', $mulai)
                ->pluck('created_at')
                ->countBy(fn ($t) => $t->format('Y-m'))
        );

        $komentarPerStatus = Komentar::select('status', DB::raw('count(*) as jumlah'))
            ->groupBy('status')
            ->pluck('jumlah', 'status');

        $artikelTerpopuler = Artikel::where('status', 'published')
            ->orderByDesc('views')
            ->limit(5)
            ->get(['artikel_id', 'judul_artikel', 'views']);

        $ceritaTerpopuler = Cerita::published()
            ->orderByDesc('views')
            ->limit(5)
            ->get(['cerita_id', 'judul_cerita', 'views']);

        $ceritaPerGenre = Cerita::published()
            ->select('genre', DB::raw('count(*) as jumlah'))
            ->groupBy('genre')
            ->orderByDesc('jumlah')
            ->limit(6)
            ->get();

        return [
            'ringkasan' => [
                'totalArtikel' => Artikel::where('status', 'published')->count(),
                'menungguModerasiArtikel' => Artikel::where('status', 'pending_review')->count(),
                'menungguModerasiKomentar' => Komentar::where('status', 'pending')->count(),
                'menungguModerasiCerita' => Cerita::where('status', 'pending_review')->count(),
                'menungguModerasiBab' => Bab::where('status', 'pending_review')->count(),
                'totalUser' => User::count(),
            ],
            'artikelPerKategori' => $artikelPerKategori,
            'userPerRole' => $userPerRole,
            'artikelPerBulan' => $artikelPerBulan,
            'userBaruPerBulan' => $userBaruPerBulan,
            'komentarPerStatus' => $komentarPerStatus,
            'artikelTerpopuler' => $artikelTerpopuler,
            'ceritaTerpopuler' => $ceritaTerpopuler,
            'ceritaPerGenre' => $ceritaPerGenre,
        ];
    }

    /**
     * Ubah hitungan per bulan ("2026-08" => 2) jadi daftar 6 bulan terakhir (termasuk bulan ini),
     * dengan 0 untuk bulan yang tidak punya data.
     */
    private function isiEnamBulan(Collection $perBulan): array
    {
        return collect(range(5, 0))
            ->map(function (int $mundur) use ($perBulan) {
                $bulan = now()->startOfMonth()->subMonths($mundur)->format('Y-m');

                return ['bulan' => $bulan, 'jumlah' => (int) $perBulan->get($bulan, 0)];
            })
            ->all();
    }
}