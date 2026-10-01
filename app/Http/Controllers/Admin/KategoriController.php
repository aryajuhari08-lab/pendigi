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
            'kategori' => Kategori::utama()
                ->withCount('artikel')
                ->with(['children' => function ($q) {
                    $q->withCount('artikel');
                }])
                ->orderBy('nama_kategori')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nama_kategori' => ['required', 'string', 'max:100', Rule::unique('kategori', 'nama_kategori')],
            'deskripsi' => ['nullable', 'string', 'max:500'],
            'parent_id' => ['nullable', 'exists:kategori,kategori_id'],
        ]);

        Kategori::create($request->only('nama_kategori', 'deskripsi', 'parent_id'));

        $pesan = $request->parent_id
            ? 'Sub-kategori berhasil ditambahkan.'
            : 'Kategori berhasil ditambahkan.';

        return back()->with('success', $pesan);
    }

    public function update(Request $request, Kategori $kategori): RedirectResponse
    {
        $validated = $request->validate([
            'nama_kategori' => ['required', 'string', 'max:255'],
            'parent_id'     => ['nullable', 'exists:kategori,kategori_id'],
            'deskripsi'     => ['nullable', 'string'],
        ]);

        $kategori->update([
            'nama_kategori' => $validated['nama_kategori'],
            'parent_id'     => $validated['parent_id'] ?: null,
            'deskripsi'     => $validated['deskripsi'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Kategori $kategori): RedirectResponse
    {
        if ($kategori->artikel()->exists()) {
            return back()->with('error', 'Kategori tidak bisa dihapus karena masih punya artikel di dalamnya.');
        }

        if ($kategori->children()->exists()) {
            return back()->with('error', 'Kategori tidak bisa dihapus karena masih punya sub-kategori di dalamnya.');
        }

        $kategori->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}