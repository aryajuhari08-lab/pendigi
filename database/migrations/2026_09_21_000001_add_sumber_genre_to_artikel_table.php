<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artikel', function (Blueprint $table) {
            // Nullable di level database supaya artikel lama (yang dibuat sebelum kolom ini ada)
            // tidak error. Wajib diisi untuk artikel baru tetap dijaga lewat validasi di controller.
            $table->string('sumber')->nullable()->after('isi_artikel');
            $table->string('genre', 50)->nullable()->after('sumber');
        });
    }

    public function down(): void
    {
        Schema::table('artikel', function (Blueprint $table) {
            $table->dropColumn(['sumber', 'genre']);
        });
    }
};