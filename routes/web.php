<?php

use App\Http\Controllers\AssetComponentController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetExtendedController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WorkStationController;
use App\Http\Middleware\RoleMiddleware;
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
    })->name('home')->middleware('role:admin');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Employee Routes
    Route::prefix('employees')->middleware(['role:admin'])->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('employees.index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('employees.create');
        Route::post('/', [EmployeeController::class, 'store'])->name('employees.store');
        Route::get('/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
        Route::patch('/{employee}/archive', [EmployeeController::class, 'archive'])->name('employees.archive');
        Route::patch('/{employee}/restore', [EmployeeController::class, 'restore'])->name('employees.restore');
        Route::get('/archived', [EmployeeController::class, 'archived'])->name('employees.archived');
        Route::get('/{employee}/create-user', [EmployeeController::class, 'createUserForm'])->name('employees.createUserForm');
        Route::post('/{employee}/create-user', [EmployeeController::class, 'createUser'])->name('employees.createUser');
        Route::put('/{employee}/update-password', [EmployeeController::class, 'updatePassword'])->name('employees.updatePassword');
    });

    // Asset Routes
    Route::prefix('assets')->group(function () {
        Route::get('/all', [AssetController::class, 'index'])->name('assets.index')->middleware(['role:admin']);;
        Route::get('/{id}', [AssetController::class, 'show'])->name('assets.show');
        Route::get('/export/download', [AssetController::class, 'exportAssets'])->name('assets.export');
        Route::get('/import/form', [AssetController::class, 'showForm'])->name('assets.showForm');
        Route::post('/import', [AssetController::class, 'importAssets'])->name('assets.import');
        Route::get('/{id}/create', [AssetController::class, 'create'])->name('assets.create');
        Route::post('/{id}', [AssetController::class, 'store'])->name('assets.store');
        Route::delete('/{assetId}/{assetNo}', [AssetController::class, 'destroy'])->name('assets.destroy');
        Route::get('/{assetId}/{assetNo}/edit', [AssetController::class, 'edit'])->name('assets.edit');
        Route::put('/{assetId}/{assetNo}', [AssetController::class, 'update'])->name('assets.update');
        Route::put('/{assetId}/{assetNo}/archive', [AssetController::class, 'archive'])->name('assets.archive');
        Route::put('/{assetId}/{assetNo}/restore', [AssetController::class, 'restore'])->name('assets.restore');

        Route::get('/employee_asset_report/{employeeId}', [AssetController::class, 'viewEmployeeAssets'])->name('assets.viewEmployeeAssets');
        Route::get('/employee/{id}', [AssetController::class, 'generateEmployeeAssetReport'])
            ->name('employee.asset.report');
    });

    // AssetExtended
    Route::get('/create', [AssetExtendedController::class, 'create'])->name('assetsextended.create');
    Route::post('/', [AssetExtendedController::class, 'store'])->name('assetsextended.store');
    Route::post('/transfer', [AssetExtendedController::class, 'transfer'])->name('assetsextended.transfer');
    Route::post('/assets/{assetNo}/archive', [AssetExtendedController::class, 'archive'])->name('assetsextended.archive');
    Route::post('/assets/{assetNo}/declassify', [AssetExtendedController::class, 'declassify'])->name('assetsextended.declassify');
    Route::post('/assets/{assetNo}/restore', [AssetExtendedController::class, 'restore'])->name('assetsextended.restore');
    Route::post('/assets/bulk-archive', [AssetExtendedController::class, 'bulkArchive'])->name('assetsextended.bulkArchive');
    Route::get('/asset/{assetNo}/edit', [AssetExtendedController::class, 'edit'])->name('assetsextended.edit');
    Route::put('/asset/{assetNo}', [AssetExtendedController::class, 'update'])->name('assetsextended.update');
    Route::post('/assets/generate-qrcodes', [AssetExtendedController::class, 'generateQRCodes'])->name('assetsextended.generateQRCodes');
    // Route::get('/assets/{id}', [AssetController::class, 'showHistory'])->name('assetsextended.history');
    // Route::get('/components', [AssetComponentController::class, 'index'])->name('components.index')->middleware(['role:admin']);
    Route::resource('assetComponents', AssetComponentController::class)->middleware(['role:admin']);
    // Department Routes
    Route::resource('departments', DepartmentController::class)->middleware(RoleMiddleware::class . ':admin');
    // Location Routes
    Route::resource('locations', LocationController::class)->middleware(RoleMiddleware::class . ':admin');
    // Workstations
    Route::resource('workstations', WorkStationController::class)->middleware(RoleMiddleware::class . ':admin');
    // Products
    Route::resource('products', ProductController::class)->middleware(RoleMiddleware::class . ':admin');

    // History Controller
    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
});

Route::get('/assets/qr/{systemAssetId}', [AssetController::class, 'generateQrCode'])->name('assets.qr');
Route::get('/assets/view/{systemAssetId}', [AssetController::class, 'showAssetDetail'])->name('assets.detail');

// Route::get('/pdf/employee_asset_report/{employeeId}', [AssetController::class, 'viewEmployeeAssets']);
