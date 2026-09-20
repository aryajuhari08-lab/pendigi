<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\DaftarNis;
use App\Models\PengajuanPublisher;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'nis' => ['required', 'string', 'max:30'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', Rule::in(['publisher', 'reader'])],
            'portofolio_teks' => ['required_if:role,publisher', 'nullable', 'string', 'max:2000'],
            'portofolio_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:2048'],
        ]);

        // Cek NIS ada di whitelist dan belum pernah dipakai akun lain
        $dataNis = DaftarNis::where('nis', $request->nis)->first();

        if (! $dataNis) {
            throw ValidationException::withMessages([
                'nis' => 'NIS tidak ditemukan. Pastikan NIS benar atau hubungi Admin untuk didaftarkan.',
            ]);
        }

        if ($dataNis->user_id) {
            throw ValidationException::withMessages([
                'nis' => 'NIS ini sudah pernah dipakai untuk mendaftar akun lain.',
            ]);
        }

        // Kecocokan nama (tidak case-sensitive, spasi berlebih diabaikan)
        $namaCocok = strcasecmp(
            trim(preg_replace('/\s+/', ' ', $request->nama_lengkap)),
            trim(preg_replace('/\s+/', ' ', $dataNis->nama_siswa)),
        ) === 0;

        if (! $namaCocok) {
            throw ValidationException::withMessages([
                'nis' => 'Nama tidak sesuai dengan data NIS ini. Pastikan nama ditulis sama persis seperti data sekolah.',
            ]);
        }

        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'nis' => $request->nis,
            'password' => Hash::make($request->password),
            'role' => 'reader',
        ]);

        $dataNis->update(['user_id' => $user->user_id]);

        if ($request->role === 'publisher') {
            $path = null;
            if ($request->hasFile('portofolio_file')) {
                $path = $request->file('portofolio_file')->store('portofolio', 'public');
            }

            PengajuanPublisher::create([
                'user_id' => $user->user_id,
                'portofolio_teks' => $request->portofolio_teks,
                'portofolio_file' => $path,
                'status' => 'pending',
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        $pesan = $request->role === 'publisher'
            ? 'Akun berhasil dibuat. Pengajuan menjadi Publisher sedang ditinjau Admin.'
            : null;

        return redirect()->route('dashboard')->with('success', $pesan);
    }
}