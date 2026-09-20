<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daftar_nis', function (Blueprint $table) {
            $table->id('nis_id');
            $table->string('nis')->unique();
            $table->string('nama_siswa');
            // Terisi otomatis begitu NIS ini dipakai untuk register, mencegah 1 NIS dipakai 2 akun
            $table->foreignId('user_id')->nullable()->constrained('users', 'user_id')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daftar_nis');
    }
};