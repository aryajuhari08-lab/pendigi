<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Kategori;
use App\Models\Komentar;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            ]),
            default => redirect()->route('home'),
        };
    }

    private function statistikAdmin(): array
    {
        $artikelPerKategori = Kategori::withCount(['artikel' => function ($q) {
            $q->where('status', 'published');
        }])->get(['kategori_id', 'nama_kategori'])
            ->map(fn ($k) => ['nama' => $k->nama_kategori, 'jumlah' => $k->artikel_count]);

        $userPerRole = User::select('role', DB::raw('count(*) as jumlah'))
            ->groupBy('role')
            ->pluck('jumlah', 'role');

        $artikelPerBulan = Artikel::where('status', 'published')
            ->where('tanggal_publikasi', '>=', now()->subMonths(5)->startOfMonth())
            ->selectRaw("DATE_FORMAT(tanggal_publikasi, '%Y-%m') as bulan, count(*) as jumlah")
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        return [
            'ringkasan' => [
                'totalArtikel' => Artikel::where('status', 'published')->count(),
                'menungguModerasiArtikel' => Artikel::where('status', 'pending_review')->count(),
                'menungguModerasiKomentar' => Komentar::where('status', 'pending')->count(),
                'totalUser' => User::count(),
            ],
            'artikelPerKategori' => $artikelPerKategori,
            'userPerRole' => $userPerRole,
            'artikelPerBulan' => $artikelPerBulan,
        ];
    }
}