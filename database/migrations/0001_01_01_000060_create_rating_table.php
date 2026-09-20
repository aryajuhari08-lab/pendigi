<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rating', function (Blueprint $table) {
            $table->id('rating_id');
            $table->foreignId('artikel_id')->constrained('artikel', 'artikel_id')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users', 'user_id')->onDelete('cascade'); // dibuat opsional, konsisten dengan tabel likes
            $table->unsignedTinyInteger('skor'); // 1-5
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rating');
    }
};
