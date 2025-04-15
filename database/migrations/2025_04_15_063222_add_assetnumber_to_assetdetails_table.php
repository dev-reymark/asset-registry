<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('assetdetails', function (Blueprint $table) {
            $table->unsignedInteger('ASSETNUMBER')->default(0)->after('ASSETNO');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assetdetails', function (Blueprint $table) {
            $table->dropColumn('ASSETNUMBER');
        });
    }
};
