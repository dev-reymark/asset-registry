<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LocationController;
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

    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
    Route::get('/locations', [LocationController::class, 'index'])->name('locations.index');
    Route::get('/workstations', [WorkStationController::class, 'index'])->name('workstations.index');

    // Asset Routes
    Route::prefix('assets')->group(function () {
        Route::get('/all', [AssetController::class, 'index'])->name('assets.index');
        Route::get('/{id}', [AssetController::class, 'show'])->name('assets.show');
        Route::get('/export-assets', [AssetController::class, 'exportAssets'])->name('assets.export');
        Route::post('/import-assets', [AssetController::class, 'importAssets'])->name('assets.import');
    });

    Route::get('/employee/{id}', [AssetController::class, 'generateEmployeeAssetReport'])
        ->name('employee.asset.report');
});

Route::get('/assets/{systemAssetId}/qr', [AssetController::class, 'generateQrCode'])->name('assets.qr');
Route::get('/assets/detail/{systemAssetId}', [AssetController::class, 'showAssetDetail'])->name('assets.detail');
