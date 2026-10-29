<?php

namespace App\Http\Controllers;

use App\Models\PengajuanPublisher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PengajuanPublisherController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Hanya reader yang perlu mengajukan. Admin dan publisher sudah punya akses menulis.
        if ($user->role !== 'reader') {
            return back()->with('error', 'Akunmu tidak perlu mengajukan menjadi Publisher.');
        }

        // Cegah pengajuan ganda selama yang sebelumnya belum diputuskan admin.
        if ($user->pengajuanPublisher()->where('status', 'pending')->exists()) {
            return back()->with('error', 'Pengajuanmu sebelumnya masih menunggu ditinjau admin.');
        }

        $validated = $request->validate([
            'portofolio_teks' => ['required', 'string', 'min:20', 'max:2000'],
            'portofolio_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:2048'],
        ], [
            'portofolio_teks.required' => 'Ceritakan dirimu dan pengalaman menulismu dulu ya.',
            'portofolio_teks.min' => 'Ceritanya terlalu singkat, tulis minimal 20 karakter.',
        ]);

        $path = $request->hasFile('portofolio_file')
            ? $request->file('portofolio_file')->store('portofolio', 'public')
            : null;

        PengajuanPublisher::create([
            'user_id' => $user->user_id,
            'portofolio_teks' => $validated['portofolio_teks'],
            'portofolio_file' => $path,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Pengajuan terkirim. Admin akan meninjaunya.');
    }
}
