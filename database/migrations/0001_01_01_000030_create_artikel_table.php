<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artikel', function (Blueprint $table) {
            $table->id('artikel_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('kategori_id')->constrained('kategori', 'kategori_id')->onDelete('restrict');
            $table->string('judul_artikel');
            $table->longText('isi_artikel');
            $table->string('gambar')->nullable();
            // draft: belum dikirim, pending_review: menunggu admin,
            // published: tayang, rejected: ditolak admin
            $table->enum('status', ['draft', 'pending_review', 'published', 'rejected'])->default('draft');
            $table->text('catatan_admin')->nullable(); // alasan reject, opsional
            $table->timestamp('tanggal_publikasi')->nullable();
            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artikel');
    }
};
