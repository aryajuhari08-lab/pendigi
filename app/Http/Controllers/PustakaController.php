<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use App\Models\Bookmark;
use App\Models\Cerita;
use App\Models\RiwayatBaca;
use App\Support\Pustaka;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PustakaController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->user_id;

        return Inertia::render('Pustaka/Index', [
            'riwayat' => Pustaka::riwayat($userId),
            'bookmark' => Pustaka::bookmark($userId),
        ]);
    }

    // Tombol simpan/lepas: klik sekali menyimpan, klik lagi melepas.
    public function bookmarkArtikel(Request $request, Artikel $artikel): RedirectResponse
    {
        abort_unless($artikel->status === 'published', 404);

        return $this->toggle($request->user()->user_id, ['artikel_id' => $artikel->artikel_id]);
    }

    public function bookmarkCerita(Request $request, Cerita $cerita): RedirectResponse
    {
        abort_unless($cerita->status === 'published', 404);

        return $this->toggle($request->user()->user_id, ['cerita_id' => $cerita->cerita_id]);
    }

    private function toggle(int $userId, array $target): RedirectResponse
    {
        $ada = Bookmark::where('user_id', $userId)->where($target)->first();

        if ($ada) {
            $ada->delete();
        } else {
            Bookmark::create(['user_id' => $userId] + $target);
        }

        return back();
    }

    public function hapusRiwayat(Request $request, RiwayatBaca $riwayat): RedirectResponse
    {
        // Riwayat itu pribadi: hanya pemiliknya yang boleh menghapus.
        abort_unless($riwayat->user_id === $request->user()->user_id, 404);

        $riwayat->delete();

        return back();
    }

    public function kosongkanRiwayat(Request $request): RedirectResponse
    {
        RiwayatBaca::where('user_id', $request->user()->user_id)->delete();

        return back();
    }
}
