<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rating_cerita', function (Blueprint $table) {
            $table->id('rating_cerita_id');
            $table->foreignId('cerita_id')->constrained('cerita', 'cerita_id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->unsignedTinyInteger('skor'); // 1-5
            $table->timestamps();

            $table->unique(['cerita_id', 'user_id']); // 1 user cuma bisa kasih 1 rating per cerita
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rating_cerita');
    }
};