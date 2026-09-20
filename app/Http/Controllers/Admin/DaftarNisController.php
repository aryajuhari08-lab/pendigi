<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DaftarNis;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DaftarNisController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/DaftarNis/Index', [
            'daftarNis' => DaftarNis::with('user:user_id,nama_lengkap')
                ->orderBy('nama_siswa')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nis' => ['required', 'string', 'max:30', Rule::unique('daftar_nis', 'nis')],
            'nama_siswa' => ['required', 'string', 'max:255'],
        ]);

        DaftarNis::create($request->only('nis', 'nama_siswa'));

        return back()->with('success', 'NIS berhasil ditambahkan ke daftar.');
    }

    public function destroy(DaftarNis $daftarNis): RedirectResponse
    {
        if ($daftarNis->user_id) {
            return back()->with('error', 'NIS ini sudah dipakai untuk registrasi, tidak bisa dihapus.');
        }

        $daftarNis->delete();

        return back()->with('success', 'NIS dihapus dari daftar.');
    }
}