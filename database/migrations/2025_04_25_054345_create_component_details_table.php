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
        Schema::create('component_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('EMPLOYEEID')->nullable();
            $table->unsignedBigInteger('PRODUCTID')->nullable();
            $table->unsignedBigInteger('ASSETCOMPNETID')->nullable();
            $table->integer('COMPONENTNUMBER');
            $table->string('SYSTEMCOMPONENTID')->nullable();
            $table->string('COMPONENTDESCRIPTION')->nullable();

            // Foreign keys if applicable
            // $table->foreign('EMPLOYEEID')->references('EMPLOYEEID')->on('employees')->onDelete('set null');
            // $table->foreign('PRODUCTID')->references('PRODUCTID')->on('products')->onDelete('set null');
            // $table->foreign('ASSETCOMPNETID')->references('ASSETCOMPNETID')->on('AssetComponents')->onDelete('set null');
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('component_details');
    }
};
