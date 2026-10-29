<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Bookmark: pilihan sadar pembaca. Satu baris = satu artikel ATAU satu cerita.
        if (! Schema::hasTable('bookmark')) {
            Schema::create('bookmark', function (Blueprint $table) {
                $table->id('bookmark_id');
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('artikel_id')->nullable();
                $table->unsignedBigInteger('cerita_id')->nullable();
                $table->timestamps();

                $table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
                $table->foreign('artikel_id')->references('artikel_id')->on('artikel')->cascadeOnDelete();
                $table->foreign('cerita_id')->references('cerita_id')->on('cerita')->cascadeOnDelete();
                $table->unique(['user_id', 'artikel_id']);
                $table->unique(['user_id', 'cerita_id']);
            });
        }

        // Riwayat baca ("aktivitas terbaru"): otomatis. Satu baris per konten per user, ditimpa tiap dibuka,
        // jadi ukurannya tidak membengkak. Untuk cerita, bab_id = bab terakhir yang dibuka.
        if (! Schema::hasTable('riwayat_baca')) {
            Schema::create('riwayat_baca', function (Blueprint $table) {
                $table->id('riwayat_id');
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('artikel_id')->nullable();
                $table->unsignedBigInteger('cerita_id')->nullable();
                $table->unsignedBigInteger('bab_id')->nullable();
                $table->timestamps();

                $table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
                $table->foreign('artikel_id')->references('artikel_id')->on('artikel')->cascadeOnDelete();
                $table->foreign('cerita_id')->references('cerita_id')->on('cerita')->cascadeOnDelete();
                $table->foreign('bab_id')->references('bab_id')->on('bab')->nullOnDelete();
                $table->unique(['user_id', 'artikel_id']);
                $table->unique(['user_id', 'cerita_id']);
                $table->index(['user_id', 'updated_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_baca');
        Schema::dropIfExists('bookmark');
    }
};
