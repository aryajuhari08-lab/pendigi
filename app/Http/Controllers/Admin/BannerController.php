<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Banner/Index', [
            'banners' => Banner::orderBy('urutan', 'asc')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul'     => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'], // Validasi deskripsi
            'gambar'    => ['required', 'image', 'max:2048'],
            'link_url'  => ['nullable', 'url', 'max:255'],
            'urutan'    => ['nullable', 'integer', 'min:0'],
            'aktif'     => ['required', 'boolean'],
        ]);

        $path = $request->file('gambar')->store('banner', 'public');

        Banner::create([
            'judul'     => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'gambar'    => $path,
            'link_url'  => $validated['link_url'] ?? null,
            'urutan'    => $validated['urutan'] ?? 0,
            'aktif'     => $validated['aktif'],
        ]);

        return redirect()->back()->with('success', 'Banner berhasil ditambahkan.');
    }

    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $validated = $request->validate([
            'judul'     => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'gambar'    => ['nullable', 'image', 'max:2048'], // Boleh kosong saat edit
            'link_url'  => ['nullable', 'url', 'max:255'],
            'urutan'    => ['nullable', 'integer', 'min:0'],
            'aktif'     => ['required', 'boolean'],
        ]);

        $path = $banner->gambar;
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama dari storage jika diganti gambar baru
            if ($banner->gambar) {
                Storage::disk('public')->delete($banner->gambar);
            }
            $path = $request->file('gambar')->store('banner', 'public');
        }

        $banner->update([
            'judul'     => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'gambar'    => $path,
            'link_url'  => $validated['link_url'] ?? null,
            'urutan'    => $validated['urutan'] ?? 0,
            'aktif'     => $validated['aktif'],
        ]);

        return redirect()->back()->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        if ($banner->gambar) {
            Storage::disk('public')->delete($banner->gambar);
        }

        $banner->delete();

        return redirect()->back()->with('success', 'Banner berhasil dihapus.');
    }
}