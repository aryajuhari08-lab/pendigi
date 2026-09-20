<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KategoriController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Kategori/Index', [
            'kategori' => Kategori::withCount('artikel')->orderBy('nama_kategori')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nama_kategori' => ['required', 'string', 'max:100', Rule::unique('kategori', 'nama_kategori')],
            'deskripsi' => ['nullable', 'string', 'max:500'],
        ]);

        Kategori::create($request->only('nama_kategori', 'deskripsi'));

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Kategori $kategori): RedirectResponse
    {
        $request->validate([
            'nama_kategori' => ['required', 'string', 'max:100', Rule::unique('kategori', 'nama_kategori')->ignore($kategori->kategori_id, 'kategori_id')],
            'deskripsi' => ['nullable', 'string', 'max:500'],
        ]);

        $kategori->update($request->only('nama_kategori', 'deskripsi'));

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Kategori $kategori): RedirectResponse
    {
        if ($kategori->artikel()->exists()) {
            return back()->with('error', 'Kategori tidak bisa dihapus karena masih punya artikel di dalamnya.');
        }

        $kategori->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}