<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Banner;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $artikel = Artikel::published()
            ->with(['kategori', 'penulis'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('judul_artikel', 'like', "%{$search}%")
                        ->orWhere('isi_artikel', 'like', "%{$search}%");
                });
            })
            ->when($request->kategori, function ($query, $kategoriId) {
                $query->where('kategori_id', $kategoriId);
            })
            ->withCount(['likes', 'rating'])
            ->latest('tanggal_publikasi')
            ->get();

        return Inertia::render('Home', [
            'artikel' => $artikel,
            'kategori' => Kategori::orderBy('nama_kategori')->get(['kategori_id', 'nama_kategori']),
            'banner' => Banner::aktif()->get(['banner_id', 'judul', 'gambar', 'link_url']),
            'filters' => $request->only('search', 'kategori'),
        ]);
    }
}