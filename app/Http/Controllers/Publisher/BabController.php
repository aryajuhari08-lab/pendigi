<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use App\Models\Bab;
use App\Models\Cerita;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BabController extends Controller
{
    public function create(Cerita $cerita): Response
    {
        abort_unless($cerita->user_id === request()->user()->user_id, 403);

        $nomorBerikutnya = ($cerita->bab()->max('nomor_bab') ?? 0) + 1;

        return Inertia::render('Publisher/Bab/Create', [
            'cerita' => $cerita->only(['cerita_id', 'judul_cerita']),
            'nomorBerikutnya' => $nomorBerikutnya,
        ]);
    }

    public function store(Request $request, Cerita $cerita): RedirectResponse
    {
        abort_unless($cerita->user_id === $request->user()->user_id, 403);

        $validated = $request->validate([
            'judul_bab' => ['required', 'string', 'max:255'],
            'isi_bab' => ['required', 'string', 'min:20'],
            'aksi' => ['required', 'in:draft,submit'],
        ]);

        $validated['isi_bab'] = clean($validated['isi_bab']);

        $nomorBerikutnya = ($cerita->bab()->max('nomor_bab') ?? 0) + 1;

        $cerita->bab()->create([
            'nomor_bab' => $nomorBerikutnya,
            'judul_bab' => $validated['judul_bab'],
            'isi_bab' => $validated['isi_bab'],
            'status' => $validated['aksi'] === 'submit' ? 'pending_review' : 'draft',
        ]);

        $pesan = $validated['aksi'] === 'submit'
            ? 'Bab berhasil dikirim untuk ditinjau admin.'
            : 'Bab berhasil disimpan sebagai draft.';

        return redirect()->route('publisher.cerita.kelola', $cerita)->with('success', $pesan);
    }

    public function edit(Bab $bab): Response
    {
        abort_unless($bab->cerita->user_id === request()->user()->user_id, 403);

        return Inertia::render('Publisher/Bab/Edit', [
            'bab' => $bab,
            'cerita' => $bab->cerita->only(['cerita_id', 'judul_cerita']),
        ]);
    }

    public function update(Request $request, Bab $bab): RedirectResponse
    {
        abort_unless($bab->cerita->user_id === $request->user()->user_id, 403);

        $validated = $request->validate([
            'judul_bab' => ['required', 'string', 'max:255'],
            'isi_bab' => ['required', 'string', 'min:20'],
            'aksi' => ['required', 'in:draft,submit'],
        ]);

        $validated['isi_bab'] = clean($validated['isi_bab']);

        $bab->update([
            'judul_bab' => $validated['judul_bab'],
            'isi_bab' => $validated['isi_bab'],
            // Bab yang sudah tayang pun, kalau diedit ulang, wajib direview lagi sebelum
            // tampil ke publik (sesuai kebijakan moderasi Pendigi).
            'status' => $validated['aksi'] === 'submit' ? 'pending_review' : 'draft',
            'catatan_admin' => $validated['aksi'] === 'submit' ? null : $bab->catatan_admin,
        ]);

        return redirect()->route('publisher.cerita.kelola', $bab->cerita_id)->with('success', 'Bab berhasil diperbarui, menunggu tinjauan admin.');
    }

    public function destroy(Bab $bab): RedirectResponse
    {
        abort_unless($bab->cerita->user_id === request()->user()->user_id, 403);

        $ceritaId = $bab->cerita_id;
        $bab->delete();

        return redirect()->route('publisher.cerita.kelola', $ceritaId)->with('success', 'Bab berhasil dihapus.');
    }
}