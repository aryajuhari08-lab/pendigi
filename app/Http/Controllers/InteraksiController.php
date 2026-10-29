<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Bab;
use App\Models\Cerita;
use App\Models\Komentar;
use App\Models\LikeCerita;
use App\Models\Likes;
use App\Models\Rating;
use App\Models\RatingCerita;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InteraksiController extends Controller
{
    public function like(Request $request, Artikel $artikel): RedirectResponse
    {
        $userId = $request->user()->user_id;

        $existing = Likes::where('artikel_id', $artikel->artikel_id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            Likes::create([
                'artikel_id' => $artikel->artikel_id,
                'user_id' => $userId,
            ]);
        }

        return back();
    }

    public function rating(Request $request, Artikel $artikel): RedirectResponse
    {
        $request->validate([
            'skor' => ['required', 'integer', 'min:1', 'max:5'],
        ]);

        Rating::updateOrCreate(
            [
                'artikel_id' => $artikel->artikel_id,
                'user_id' => $request->user()->user_id,
            ],
            ['skor' => $request->skor],
        );

        return back()->with('success', 'Rating berhasil disimpan.');
    }

    public function ratingCerita(Request $request, Cerita $cerita): RedirectResponse
    {
        $request->validate([
            'skor' => ['required', 'integer', 'min:1', 'max:5'],
        ]);

        RatingCerita::updateOrCreate(
            [
                'cerita_id' => $cerita->cerita_id,
                'user_id' => $request->user()->user_id,
            ],
            ['skor' => $request->skor],
        );

        return back()->with('success', 'Rating berhasil disimpan.');
    }

    public function likeCerita(Request $request, Cerita $cerita): RedirectResponse
    {
        abort_unless($cerita->status === 'published', 404);

        $userId = $request->user()->user_id;

        $existing = LikeCerita::where('cerita_id', $cerita->cerita_id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            LikeCerita::create(['cerita_id' => $cerita->cerita_id, 'user_id' => $userId]);
        }

        return back();
    }

    public function komentarBab(Request $request, Bab $bab): RedirectResponse
    {
        abort_unless($bab->status === 'published' && $bab->cerita->status === 'published', 404);

        $request->validate([
            'komentar' => ['required', 'string', 'max:1000'],
        ]);

        Komentar::create([
            'user_id' => $request->user()->user_id,
            'bab_id' => $bab->bab_id,
            'komentar' => $request->komentar,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Komentar terkirim, menunggu persetujuan admin.');
    }

    public function komentar(Request $request, Artikel $artikel): RedirectResponse
    {
        $request->validate([
            'komentar' => ['required', 'string', 'max:1000'],
        ]);

        Komentar::create([
            'user_id' => $request->user()->user_id,
            'artikel_id' => $artikel->artikel_id,
            'komentar' => $request->komentar,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Komentar terkirim, menunggu persetujuan admin.');
    }

    public function balasKomentar(Request $request, Komentar $komentar): RedirectResponse
    {
        $request->validate([
            'komentar' => ['required', 'string', 'max:1000'],
        ]);

        $userId = $request->user()->user_id;

        // Balasan mengikuti induknya: komentar artikel dibalas di artikel, komentar bab dibalas di bab.
        if ($komentar->bab_id) {
            $isPenulisKonten = $komentar->bab->cerita->user_id === $userId;
            $tujuan = ['bab_id' => $komentar->bab_id];
        } else {
            $isPenulisKonten = $komentar->artikel->user_id === $userId;
            $tujuan = ['artikel_id' => $komentar->artikel_id];
        }

        Komentar::create([
            'user_id' => $userId,
            ...$tujuan,
            'parent_id' => $komentar->komentar_id,
            'komentar' => $request->komentar,
            'status' => $isPenulisKonten ? 'approved' : 'pending',
        ]);

        $pesan = $isPenulisKonten
            ? 'Balasan berhasil dikirim.'
            : 'Balasan terkirim, menunggu persetujuan admin.';

        return back()->with('success', $pesan);
    }
}