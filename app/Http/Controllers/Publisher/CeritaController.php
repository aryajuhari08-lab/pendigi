<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use App\Models\Cerita;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CeritaController extends Controller
{
    // Daftar genre tetap (sesuai kebutuhan sekolah, bisa ditambah nanti kalau perlu)
    public const GENRE_OPTIONS = [
        'Romance', 'Horror', 'Thriller', 'Mystery', 'Science Fiction',
        'Comedy', 'Adventure', 'Drama', 'Fantasy', 'Historical', 'Action', 'Slice of Life', 'Supernatural', 'Crime',
        'Magic Realism', 'Philosophical', 
    ];

    public function index(Request $request): Response
    {
        return Inertia::render('Publisher/Cerita/Index', [
            'cerita' => $request->user()->cerita()
                ->withCount(['bab as jumlah_bab'])
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Publisher/Cerita/Create', [
            'genreOptions' => self::GENRE_OPTIONS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul_cerita' => ['required', 'string', 'max:255'],
            'sinopsis' => ['required', 'string', 'max:2000'],
            'genre' => ['required', 'string', Rule::in(self::GENRE_OPTIONS)],
            'tag' => ['nullable', 'string', 'max:255'],
            'rating_usia' => ['required', 'in:semua_umur,remaja,dewasa'],
            'sampul' => ['nullable', 'image', 'max:2048'],
            'aksi' => ['required', 'in:draft,submit'],
        ]);

        $path = null;
        if ($request->hasFile('sampul')) {
            $path = $request->file('sampul')->store('cerita', 'public');
        }

        $cerita = $request->user()->cerita()->create([
            'judul_cerita' => $validated['judul_cerita'],
            'sinopsis' => $validated['sinopsis'],
            'genre' => $validated['genre'],
            'tag' => $validated['tag'] ?? null,
            'rating_usia' => $validated['rating_usia'],
            'sampul' => $path,
            'status' => $validated['aksi'] === 'submit' ? 'pending_review' : 'draft',
        ]);

        $pesan = $validated['aksi'] === 'submit'
            ? 'Cerita berhasil dikirim untuk ditinjau admin.'
            : 'Cerita berhasil disimpan sebagai draft.';

        return redirect()->route('publisher.cerita.kelola', $cerita)->with('success', $pesan);
    }

    public function kelola(Cerita $cerita): Response
    {
        abort_unless($cerita->user_id === request()->user()->user_id, 403);

        return Inertia::render('Publisher/Cerita/Kelola', [
            'cerita' => $cerita,
            'bab' => $cerita->bab()->get(),
        ]);
    }

    public function edit(Cerita $cerita): Response
    {
        abort_unless($cerita->user_id === request()->user()->user_id, 403);

        return Inertia::render('Publisher/Cerita/Edit', [
            'cerita' => $cerita,
            'genreOptions' => self::GENRE_OPTIONS,
        ]);
    }

    public function update(Request $request, Cerita $cerita): RedirectResponse
    {
        abort_unless($cerita->user_id === $request->user()->user_id, 403);

        $validated = $request->validate([
            'judul_cerita' => ['required', 'string', 'max:255'],
            'sinopsis' => ['required', 'string', 'max:2000'],
            'genre' => ['required', 'string', Rule::in(self::GENRE_OPTIONS)],
            'tag' => ['nullable', 'string', 'max:255'],
            'rating_usia' => ['required', 'in:semua_umur,remaja,dewasa'],
            'sampul' => ['nullable', 'image', 'max:2048'],
            'aksi' => ['required', 'in:draft,submit'],
        ]);

        $path = $cerita->sampul;
        if ($request->hasFile('sampul')) {
            $path = $request->file('sampul')->store('cerita', 'public');
        }

        $cerita->update([
            'judul_cerita' => $validated['judul_cerita'],
            'sinopsis' => $validated['sinopsis'],
            'genre' => $validated['genre'],
            'tag' => $validated['tag'] ?? null,
            'rating_usia' => $validated['rating_usia'],
            'sampul' => $path,
            'status' => $validated['aksi'] === 'submit' ? 'pending_review' : 'draft',
            'catatan_admin' => $validated['aksi'] === 'submit' ? null : $cerita->catatan_admin,
        ]);

        return redirect()->route('publisher.cerita.kelola', $cerita)->with('success', 'Info cerita berhasil diperbarui.');
    }

    public function toggleProgres(Cerita $cerita): RedirectResponse
    {
        abort_unless($cerita->user_id === request()->user()->user_id, 403);

        $cerita->update([
            'status_progres' => $cerita->status_progres === 'berlangsung' ? 'tamat' : 'berlangsung',
        ]);

        return back()->with('success', 'Status cerita diperbarui.');
    }

    public function destroy(Cerita $cerita): RedirectResponse
    {
        abort_unless($cerita->user_id === request()->user()->user_id, 403);

        if ($cerita->sampul) {
            Storage::disk('public')->delete($cerita->sampul);
        }

        // Semua bab & rating milik cerita ini ikut terhapus otomatis (onDelete cascade)
        $cerita->delete();

        return redirect()->route('dashboard')->with('success', 'Cerita berhasil dihapus.');
    }
}