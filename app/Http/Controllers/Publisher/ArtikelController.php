<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Kategori;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ArtikelController extends Controller
{
    private function daftarKategori()
    {
        return Kategori::utama()
            ->with('children:kategori_id,parent_id,nama_kategori')
            ->orderBy('nama_kategori')
            ->get(['kategori_id', 'nama_kategori']);
    }

    public function create(): Response
    {
        return Inertia::render('Publisher/Artikel/Create', [
            'kategori' => $this->daftarKategori(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul_artikel' => ['required', 'string', 'max:255'],
            'kategori_id' => ['required', 'exists:kategori,kategori_id'],
            'isi_artikel' => ['required', 'string', 'min:50'],
            'sumber' => ['required', 'string', 'max:255'],
            'genre' => ['nullable', 'string', 'max:50'],
            'gambar' => ['nullable', 'image', 'max:2048'],
            'aksi' => ['required', 'in:draft,submit'],
        ]);

        // Bersihkan HTML dari isi CKEditor sebelum disimpan, cegah stored XSS
        // (script, onerror, javascript: dsb otomatis dibuang oleh HTMLPurifier).
        $validated['isi_artikel'] = \App\Support\KontenBersih::bersihkan($validated['isi_artikel']);

        $path = null;
        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('artikel', 'public');
        }

        $request->user()->artikel()->create([
            'kategori_id' => $validated['kategori_id'],
            'judul_artikel' => $validated['judul_artikel'],
            'isi_artikel' => $validated['isi_artikel'],
            'sumber' => $validated['sumber'],
            'genre' => $validated['genre'] ?? null,
            'gambar' => $path,
            'status' => $validated['aksi'] === 'submit' ? 'pending_review' : 'draft',
        ]);

        $pesan = $validated['aksi'] === 'submit'
            ? 'Artikel berhasil dikirim untuk ditinjau admin.'
            : 'Artikel berhasil disimpan sebagai draft.';

        return redirect()->route('dashboard')->with('success', $pesan);
    }

    public function edit(Artikel $artikel): Response
    {
        abort_unless($artikel->user_id === request()->user()->user_id, 403);

        return Inertia::render('Publisher/Artikel/Edit', [
            'artikel' => $artikel,
            'kategori' => $this->daftarKategori(),
        ]);
    }

    public function update(Request $request, Artikel $artikel): RedirectResponse
    {
        abort_unless($artikel->user_id === $request->user()->user_id, 403);

        $validated = $request->validate([
            'judul_artikel' => ['required', 'string', 'max:255'],
            'kategori_id' => ['required', 'exists:kategori,kategori_id'],
            'isi_artikel' => ['required', 'string', 'min:50'],
            'sumber' => ['required', 'string', 'max:255'],
            'genre' => ['nullable', 'string', 'max:50'],
            'gambar' => ['nullable', 'image', 'max:2048'],
            'aksi' => ['required', 'in:draft,submit'],
        ]);

        $validated['isi_artikel'] = \App\Support\KontenBersih::bersihkan($validated['isi_artikel']);

        $path = $artikel->gambar;
        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('artikel', 'public');

            // Gambar lama dihapus setelah yang baru berhasil tersimpan, supaya file tidak menumpuk di server
            if ($artikel->gambar) {
                Storage::disk('public')->delete($artikel->gambar);
            }
        }

        $artikel->update([
            'kategori_id' => $validated['kategori_id'],
            'judul_artikel' => $validated['judul_artikel'],
            'isi_artikel' => $validated['isi_artikel'],
            'sumber' => $validated['sumber'],
            'genre' => $validated['genre'] ?? null,
            'gambar' => $path,
            // Artikel yang ditolak lalu direvisi otomatis balik ke antrian pending_review
            'status' => $validated['aksi'] === 'submit' ? 'pending_review' : 'draft',
            'catatan_admin' => $validated['aksi'] === 'submit' ? null : $artikel->catatan_admin,
        ]);

        return redirect()->route('dashboard')->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(Artikel $artikel): RedirectResponse
    {
        abort_unless($artikel->user_id === request()->user()->user_id, 403);

        if ($artikel->gambar) {
            Storage::disk('public')->delete($artikel->gambar);
        }

        // komentar, likes, dan rating milik artikel ini ikut terhapus otomatis (onDelete cascade)
        $artikel->delete();

        return redirect()->route('dashboard')->with('success', 'Artikel berhasil dihapus.');
    }
}