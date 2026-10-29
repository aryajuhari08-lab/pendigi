<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Membuat akun admin pertama supaya halaman admin bisa diakses di instalasi baru.
     *
     * Isi di .env sebelum menjalankan `php artisan db:seed`:
     *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
     *
     * Kalau ADMIN_PASSWORD kosong, password acak dibuat dan ditampilkan sekali di terminal.
     * Kalau email tersebut sudah terdaftar, akunnya tidak diubah sama sekali.
     */
    public function run(): void
    {
        $email = strtolower((string) env('ADMIN_EMAIL', 'admin@pendigi.test'));

        if (User::where('email', $email)->exists()) {
            $this->command?->warn("Akun {$email} sudah ada, dilewati.");

            return;
        }

        $password = env('ADMIN_PASSWORD') ?: Str::password(16, symbols: false);

        User::create([
            'nama_lengkap' => env('ADMIN_NAME', 'Administrator'),
            'email' => $email,
            'password' => $password, // di-hash otomatis oleh cast 'hashed' di model User
            'role' => 'admin',
        ]);

        $this->command?->info("Admin dibuat: {$email}");

        if (! env('ADMIN_PASSWORD')) {
            $this->command?->warn("Password sementara: {$password}  (catat sekarang, tidak ditampilkan lagi)");
        }
    }
}