<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Banner;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Support\Pustaka;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $artikel = Artikel::published()
            ->with(['kategori', 'penulis:user_id,nama_lengkap,foto_profil'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('judul_artikel', 'like', "%{$search}%")
                        ->orWhere('isi_artikel', 'like', "%{$search}%");
                });
            })
            ->when($request->kategori, function ($query, $kategoriId) {
                // Kalau yang dipilih kategori induk, ikutkan juga artikel di sub-kategorinya.
                $ids = Kategori::where('kategori_id', $kategoriId)
                    ->orWhere('parent_id', $kategoriId)
                    ->pluck('kategori_id');
                $query->whereIn('kategori_id', $ids);
            })
            ->withCount(['likes', 'rating'])
            ->latest('tanggal_publikasi')
            ->orderByDesc('artikel_id') // urutan tetap stabil walau tanggalnya sama, supaya tidak ada artikel ganda/hilang antar halaman
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Home', [
            'artikel' => $artikel,
            'kategori' => Kategori::utama()
                ->with('children:kategori_id,parent_id,nama_kategori')
                ->orderBy('nama_kategori')
                ->get(['kategori_id', 'nama_kategori']),
            'banner' => Banner::aktif()->get(['banner_id', 'judul', 'deskripsi', 'gambar', 'link_url']),
            'filters' => $request->only('search', 'kategori'),
            // Baris "Lanjutkan membaca" untuk user yang login (4 terbaru); tamu tidak punya riwayat.
            'lanjutBaca' => $request->user() ? Pustaka::riwayat($request->user()->user_id, 4) : [],
        ]);
    }
}