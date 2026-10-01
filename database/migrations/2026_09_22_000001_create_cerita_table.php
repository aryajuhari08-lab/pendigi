<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cerita', function (Blueprint $table) {
            $table->id('cerita_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->string('judul_cerita');
            $table->longText('sinopsis');
            $table->string('genre');
            $table->string('tag')->nullable(); // disimpan dipisah koma, mis: "teen_drama,friendship"
            $table->string('sampul')->nullable();
            $table->enum('rating_usia', ['semua_umur', 'remaja', 'dewasa'])->default('semua_umur');
            $table->enum('status_progres', ['berlangsung', 'tamat'])->default('berlangsung');
            // Status moderasi cerita (info dasarnya saja): draft, pending_review, published, rejected
            $table->enum('status', ['draft', 'pending_review', 'published', 'rejected'])->default('draft');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cerita');
    }
};