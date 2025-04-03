<?php

use App\Http\Controllers\AssetComponentController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WorkStationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', [AuthController::class, 'login'])->name('login.post');

Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Home');
    })->name('home');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Employee Routes
    Route::prefix('employees')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('employees.index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('employees.create');
        Route::post('/', [EmployeeController::class, 'store'])->name('employees.store');
        Route::get('/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    });

    // Asset Routes
    Route::prefix('assets')->group(function () {
        Route::get('/all', [AssetController::class, 'index'])->name('assets.index');
        Route::get('/{id}', [AssetController::class, 'show'])->name('assets.show');
        Route::get('/export/download', [AssetController::class, 'exportAssets'])->name('assets.export');
        Route::post('/import', [AssetController::class, 'importAssets'])->name('assets.import');
        Route::get('/{id}/create', [AssetController::class, 'create'])->name('assets.create');
        Route::post('/{id}', [AssetController::class, 'store'])->name('assets.store');
        Route::delete('/{assetId}/{assetNo}', [AssetController::class, 'destroy'])->name('assets.destroy');
        Route::get('/{assetId}/{assetNo}/edit', [AssetController::class, 'edit'])->name('assets.edit');
        Route::put('/{assetId}/{assetNo}', [AssetController::class, 'update'])->name('assets.update');
    });

    Route::get('/components', [AssetComponentController::class, 'index'])->name('components.index');
    Route::resource('assetComponents', AssetComponentController::class);

    // Department Routes
    Route::prefix('departments')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('departments.index');
        Route::get('/create', [DepartmentController::class, 'create'])->name('departments.create');
        Route::post('/', [DepartmentController::class, 'store'])->name('departments.store');
    });

    // Location Routes
    Route::prefix('locations')->group(function () {
        Route::get('/', [LocationController::class, 'index'])->name('locations.index');
        Route::get('/create', [LocationController::class, 'create'])->name('locations.create');
        Route::post('/', [LocationController::class, 'store'])->name('locations.store');
    });

    Route::prefix('workstations')->group(function () {
        Route::get('/', [WorkStationController::class, 'index'])->name('workstations.index');
        Route::get('/create', [WorkStationController::class, 'create'])->name('workstations.create');
        Route::post('/', [WorkStationController::class, 'store'])->name('workstations.store');
    });

    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('products.index');
        Route::get('/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/', [ProductController::class, 'store'])->name('products.store');
    });


    Route::get('/employee/{id}', [AssetController::class, 'generateEmployeeAssetReport'])
        ->name('employee.asset.report');
});

Route::get('/assets/{systemAssetId}/qr', [AssetController::class, 'generateQrCode'])->name('assets.qr');
Route::get('/assets/detail/{systemAssetId}', [AssetController::class, 'showAssetDetail'])->name('assets.detail');
