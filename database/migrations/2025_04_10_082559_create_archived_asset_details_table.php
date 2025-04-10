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
        Schema::create('archived_asset_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('asset_detail_id');
            $table->string('archival_reason');
            $table->string('status');
            $table->text('conditions');
            $table->timestamp('archived_at')->useCurrent();
            $table->timestamps();
            // $table->foreign('asset_detail_id')->references('ASSETNO')->on('AssetDetails')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archived_asset_details');
    }
};
