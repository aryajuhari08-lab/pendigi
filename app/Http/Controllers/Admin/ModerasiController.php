<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Bab;
use App\Models\Cerita;
use App\Models\Komentar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModerasiController extends Controller
{
    public function artikel(): Response
    {
        return Inertia::render('Admin/Moderasi/Artikel', [
            'artikel' => Artikel::with(['penulis', 'kategori'])
                ->where('status', 'pending_review')
                ->latest()
                ->get(),
        ]);
    }

    public function approveArtikel(Artikel $artikel): RedirectResponse
    {
        $artikel->update([
            'status' => 'published',
            'tanggal_publikasi' => now(),
        ]);

        return back()->with('success', "Artikel \"{$artikel->judul_artikel}\" berhasil dipublish.");
    }

    public function rejectArtikel(Request $request, Artikel $artikel): RedirectResponse
    {
        $request->validate([
            'catatan_admin' => ['nullable', 'string', 'max:500'],
        ]);

        $artikel->update([
            'status' => 'rejected',
            'catatan_admin' => $request->catatan_admin,
        ]);

        return back()->with('success', "Artikel \"{$artikel->judul_artikel}\" ditolak.");
    }

    public function komentar(): Response
    {
        return Inertia::render('Admin/Moderasi/Komentar', [
            'komentar' => Komentar::with(['penulis', 'artikel'])
                ->where('status', 'pending')
                ->orderBy('create_at')
                ->get(),
        ]);
    }

    public function approveKomentar(Komentar $komentar): RedirectResponse
    {
        $komentar->update(['status' => 'approved']);

        return back()->with('success', 'Komentar berhasil disetujui.');
    }

    public function rejectKomentar(Komentar $komentar): RedirectResponse
    {
        $komentar->update(['status' => 'rejected']);

        return back()->with('success', 'Komentar ditolak dan disembunyikan.');
    }

    public function cerita(): Response
    {
        return Inertia::render('Admin/Moderasi/Cerita', [
            'cerita' => Cerita::with('penulis')
                ->where('status', 'pending_review')
                ->latest()
                ->get(),
        ]);
    }

    public function approveCerita(Cerita $cerita): RedirectResponse
    {
        $cerita->update(['status' => 'published']);

        return back()->with('success', "Cerita \"{$cerita->judul_cerita}\" berhasil dipublish.");
    }

    public function rejectCerita(Request $request, Cerita $cerita): RedirectResponse
    {
        $request->validate([
            'catatan_admin' => ['nullable', 'string', 'max:500'],
        ]);

        $cerita->update([
            'status' => 'rejected',
            'catatan_admin' => $request->catatan_admin,
        ]);

        return back()->with('success', "Cerita \"{$cerita->judul_cerita}\" ditolak.");
    }

    public function bab(): Response
    {
        return Inertia::render('Admin/Moderasi/Bab', [
            'bab' => Bab::with('cerita')
                ->where('status', 'pending_review')
                ->latest()
                ->get(),
        ]);
    }

    public function approveBab(Bab $bab): RedirectResponse
    {
        $bab->update(['status' => 'published']);

        return back()->with('success', "Bab \"{$bab->judul_bab}\" berhasil dipublish.");
    }

    public function rejectBab(Request $request, Bab $bab): RedirectResponse
    {
        $request->validate([
            'catatan_admin' => ['nullable', 'string', 'max:500'],
        ]);

        $bab->update([
            'status' => 'rejected',
            'catatan_admin' => $request->catatan_admin,
        ]);

        return back()->with('success', "Bab \"{$bab->judul_bab}\" ditolak.");
    }
}