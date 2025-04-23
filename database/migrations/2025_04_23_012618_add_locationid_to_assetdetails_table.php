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
        Schema::table('AssetDetails', function (Blueprint $table) {
            $table->unsignedInteger('LOCATIONID')->nullable()->after('WORKSTATION');
            $table->foreign('LOCATIONID')->references('LOCATIONID')->on('Location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('AssetDetails', function (Blueprint $table) {
            $table->dropForeign(['LOCATIONID']);
            $table->dropColumn('LOCATIONID');
        });
    }
};
