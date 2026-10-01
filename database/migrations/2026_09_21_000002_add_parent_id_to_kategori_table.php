<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kategori', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('kategori_id')
                ->constrained('kategori', 'kategori_id')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('kategori', function (Blueprint $table) {
            $table->dropConstrainedForeignId('parent_id');
        });
    }
};