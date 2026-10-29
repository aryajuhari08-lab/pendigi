<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Bab;
use App\Models\Cerita;
use App\Models\Komentar;
use App\Notifications\KeputusanModerasi;
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

        $artikel->penulis?->notify(KeputusanModerasi::artikel($artikel, true));

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

        $artikel->penulis?->notify(KeputusanModerasi::artikel($artikel, false));

        return back()->with('success', "Artikel \"{$artikel->judul_artikel}\" ditolak.");
    }

    public function komentar(): Response
    {
        return Inertia::render('Admin/Moderasi/Komentar', [
            'komentar' => Komentar::with(['penulis', 'artikel', 'bab.cerita', 'induk.penulis:user_id,nama_lengkap'])
                ->where('status', 'pending')
                ->orderBy('create_at')
                ->get(),
        ]);
    }

    /**
     * Riwayat komentar yang sudah diputuskan (disetujui/ditolak): siapa admin yang meninjau dan kapan.
     * Komentar lama yang diputuskan sebelum fitur ini ada tidak punya catatan peninjau (kolom kosong).
     */
    public function riwayatKomentar(Request $request): Response
    {
        $status = in_array($request->status, ['approved', 'rejected'], true) ? $request->status : null;

        $riwayat = Komentar::with([
            'penulis:user_id,nama_lengkap,foto_profil',
            'artikel:artikel_id,judul_artikel',
            'bab.cerita:cerita_id,judul_cerita',
            'peninjau:user_id,nama_lengkap',
        ])
            ->where('status', '!=', 'pending')
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByRaw('COALESCE(direview_pada, create_at) DESC')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Moderasi/RiwayatKomentar', [
            'riwayat' => $riwayat,
            'filters' => ['status' => $status],
        ]);
    }

    public function approveKomentar(Komentar $komentar): RedirectResponse
    {
        $komentar->update(['status' => 'approved', 'direview_oleh' => auth()->id(), 'direview_pada' => now()]);

        return back()->with('success', 'Komentar berhasil disetujui.');
    }

    public function rejectKomentar(Komentar $komentar): RedirectResponse
    {
        $komentar->update(['status' => 'rejected', 'direview_oleh' => auth()->id(), 'direview_pada' => now()]);

        return back()->with('success', 'Komentar ditolak dan disembunyikan.');
    }

    public function cerita(): Response
    {
        return Inertia::render('Admin/Moderasi/Cerita', [
            'cerita' => Cerita::with('penulis')->withCount('bab as jumlah_bab')
                ->where('status', 'pending_review')
                ->latest()
                ->get(),
        ]);
    }

    public function approveCerita(Cerita $cerita): RedirectResponse
    {
        $cerita->update(['status' => 'published']);

        $cerita->penulis?->notify(KeputusanModerasi::cerita($cerita, true));

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

        $cerita->penulis?->notify(KeputusanModerasi::cerita($cerita, false));

        return back()->with('success', "Cerita \"{$cerita->judul_cerita}\" ditolak.");
    }

    public function bab(): Response
    {
        return Inertia::render('Admin/Moderasi/Bab', [
            'bab' => Bab::with('cerita.penulis:user_id,nama_lengkap,foto_profil')
                ->where('status', 'pending_review')
                ->latest()
                ->get(),
        ]);
    }

    public function approveBab(Bab $bab): RedirectResponse
    {
        $bab->update(['status' => 'published']);

        $bab->cerita->penulis?->notify(KeputusanModerasi::bab($bab, true));

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

        $bab->cerita->penulis?->notify(KeputusanModerasi::bab($bab, false));

        return back()->with('success', "Bab \"{$bab->judul_bab}\" ditolak.");
    }
}