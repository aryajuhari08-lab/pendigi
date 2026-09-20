<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('komentar', function (Blueprint $table) {
            $table->id('komentar_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('artikel_id')->constrained('artikel', 'artikel_id')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('komentar', 'komentar_id')->onDelete('cascade'); // untuk balasan publisher
            $table->text('komentar');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('create_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('komentar');
    }
};
