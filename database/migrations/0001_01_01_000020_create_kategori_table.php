<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kategori', function (Blueprint $table) {
            $table->id('kategori_id');
            $table->string('nama_kategori');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });

        // Seed 4 kategori utama Pendigi
        \DB::table('kategori')->insert([
            ['nama_kategori' => 'Hot News', 'deskripsi' => 'Berita terbaru seputar SMKN 11 Bandung maupun yang sedang ramai dibahas.', 'created_at' => now(), 'updated_at' => now()],
            ['nama_kategori' => 'Tips & Trik', 'deskripsi' => 'Panduan atau tutorial: belajar, memasak, traveling, teknologi, dll.', 'created_at' => now(), 'updated_at' => now()],
            ['nama_kategori' => 'Fiksi', 'deskripsi' => 'Cerpen, horor, romantis, fantasi, dan karya imajinasi lainnya.', 'created_at' => now(), 'updated_at' => now()],
            ['nama_kategori' => 'Non Fiksi', 'deskripsi' => 'Pengalaman nyata, opini, motivasi, review, kisah inspiratif.', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('kategori');
    }
};
