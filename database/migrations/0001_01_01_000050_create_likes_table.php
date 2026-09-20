<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id('sukai_id');
            $table->foreignId('artikel_id')->constrained('artikel', 'artikel_id')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users', 'user_id')->onDelete('cascade'); // opsional: reader belum login tetap bisa like
            $table->string('anon_identifier')->nullable(); // fallback identitas anonim (mis. session/IP hash) agar 1 like per pengunjung
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
