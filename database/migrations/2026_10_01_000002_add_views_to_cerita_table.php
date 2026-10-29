<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('cerita', 'views')) {
            Schema::table('cerita', function (Blueprint $table) {
                $table->unsignedBigInteger('views')->default(0)->after('status_progres');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('cerita', 'views')) {
            Schema::table('cerita', function (Blueprint $table) {
                $table->dropColumn('views');
            });
        }
    }
};