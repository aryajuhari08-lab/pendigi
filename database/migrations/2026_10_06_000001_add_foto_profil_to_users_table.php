<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Dijaga hasColumn supaya aman kalau kolomnya sudah ditambahkan manual lewat SQL.
        if (! Schema::hasColumn('users', 'foto_profil')) {
            Schema::table('users', function (Blueprint $table) {
                // Path file di disk 'public', mis. "avatar/abc123.jpg"
                $table->string('foto_profil')->nullable()->after('role');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'foto_profil')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('foto_profil');
            });
        }
    }
};
