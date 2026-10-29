<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Komentar kini bisa menempel ke artikel ATAU bab cerita, plus jejak siapa/kapan admin meninjaunya.
        // Dijaga hasColumn / hasTable supaya aman kalau sudah dijalankan manual lewat SQL.
        if (! Schema::hasColumn('komentar', 'bab_id')) {
            Schema::table('komentar', function (Blueprint $table) {
                $table->unsignedBigInteger('artikel_id')->nullable()->change();
                $table->unsignedBigInteger('bab_id')->nullable()->after('artikel_id');
                $table->unsignedBigInteger('direview_oleh')->nullable()->after('status');
                $table->timestamp('direview_pada')->nullable()->after('direview_oleh');

                $table->foreign('bab_id')->references('bab_id')->on('bab')->cascadeOnDelete();
                $table->foreign('direview_oleh')->references('user_id')->on('users')->nullOnDelete();
            });
        }

        if (! Schema::hasTable('like_cerita')) {
            Schema::create('like_cerita', function (Blueprint $table) {
                $table->id('like_cerita_id');
                $table->unsignedBigInteger('cerita_id');
                $table->unsignedBigInteger('user_id');
                $table->timestamps();

                $table->foreign('cerita_id')->references('cerita_id')->on('cerita')->cascadeOnDelete();
                $table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
                $table->unique(['cerita_id', 'user_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('like_cerita');

        if (Schema::hasColumn('komentar', 'bab_id')) {
            Schema::table('komentar', function (Blueprint $table) {
                $table->dropForeign(['bab_id']);
                $table->dropForeign(['direview_oleh']);
                $table->dropColumn(['bab_id', 'direview_oleh', 'direview_pada']);
            });
        }
    }
};
