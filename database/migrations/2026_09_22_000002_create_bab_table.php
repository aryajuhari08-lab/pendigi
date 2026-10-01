<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bab', function (Blueprint $table) {
            $table->id('bab_id');
            $table->foreignId('cerita_id')->constrained('cerita', 'cerita_id')->onDelete('cascade');
            $table->unsignedInteger('nomor_bab');
            $table->string('judul_bab');
            $table->longText('isi_bab');
            $table->unsignedBigInteger('views')->default(0);
            // Setiap bab (baru atau hasil edit ulang) wajib direview admin lagi sebelum tayang
            $table->enum('status', ['draft', 'pending_review', 'published', 'rejected'])->default('draft');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bab');
    }
};