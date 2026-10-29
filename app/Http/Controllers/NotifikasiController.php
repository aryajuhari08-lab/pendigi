<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    // Klik notifikasi: tandai sudah dibaca, lalu pindah ke halaman tujuannya.
    public function buka(Request $request, string $id): RedirectResponse
    {
        // Dicari lewat relasi milik user ini, jadi notifikasi orang lain otomatis 404.
        $notifikasi = $request->user()->notifications()->findOrFail($id);
        $notifikasi->markAsRead();

        return redirect($notifikasi->data['url'] ?? route('home', [], false));
    }

    public function bacaSemua(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return back();
    }
}
