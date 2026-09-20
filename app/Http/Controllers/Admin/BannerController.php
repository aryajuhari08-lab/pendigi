<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Banner/Index', [
            'banner' => Banner::orderBy('urutan')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'gambar' => ['required', 'image', 'max:3072'],
            'link_url' => ['nullable', 'string', 'max:500'],
        ]);

        $path = $request->file('gambar')->store('banner', 'public');
        $urutanTerakhir = Banner::max('urutan') ?? 0;

        Banner::create([
            'judul' => $request->judul,
            'gambar' => $path,
            'link_url' => $request->link_url,
            'urutan' => $urutanTerakhir + 1,
        ]);

        return back()->with('success', 'Banner berhasil ditambahkan.');
    }

    public function toggleAktif(Banner $banner): RedirectResponse
    {
        $banner->update(['aktif' => ! $banner->aktif]);

        return back()->with('success', 'Status banner diperbarui.');
    }

    public function updateUrutan(Request $request): RedirectResponse
    {
        $request->validate([
            'urutan' => ['required', 'array'],
            'urutan.*' => ['required', 'integer', 'exists:banner,banner_id'],
        ]);

        foreach ($request->urutan as $index => $bannerId) {
            Banner::where('banner_id', $bannerId)->update(['urutan' => $index]);
        }

        return back()->with('success', 'Urutan banner diperbarui.');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        $banner->delete();

        return back()->with('success', 'Banner dihapus.');
    }
}