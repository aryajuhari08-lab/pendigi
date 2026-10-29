<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PengajuanPublisher;
use App\Notifications\KeputusanModerasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Pengajuan/Index', [
            'pengajuan' => PengajuanPublisher::with('user')
                ->where('status', 'pending')
                ->latest()
                ->get(),
        ]);
    }

    public function approve(PengajuanPublisher $pengajuan): RedirectResponse
    {
        $pengajuan->update(['status' => 'approved']);
        $pengajuan->user()->update(['role' => 'publisher']);

        $pengajuan->user->notify(KeputusanModerasi::pengajuan($pengajuan, true));

        return back()->with('success', "{$pengajuan->user->nama_lengkap} sekarang jadi Publisher.");
    }

    public function reject(Request $request, PengajuanPublisher $pengajuan): RedirectResponse
    {
        $request->validate([
            'catatan_admin' => ['nullable', 'string', 'max:500'],
        ]);

        $pengajuan->update([
            'status' => 'rejected',
            'catatan_admin' => $request->catatan_admin,
        ]);

        $pengajuan->user->notify(KeputusanModerasi::pengajuan($pengajuan, false));

        return back()->with('success', 'Pengajuan ditolak.');
    }
}