<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobOfferController;
use App\Http\Controllers\Api\TestController;
use Illuminate\Support\Facades\Route;

// ── Public ───────────────────────────────────────────────────
Route::get('/test', [TestController::class, 'index']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ── Protected ────────────────────────────────────────────────
Route::middleware('auth:api')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });

    // Jobs
    Route::prefix('jobs')->group(function () {
        Route::get('/',        [JobOfferController::class, 'index']);
        Route::get('/my-jobs', [JobOfferController::class, 'myJobs']);
        Route::get('/{id}',    [JobOfferController::class, 'show']);
        Route::post('/',       [JobOfferController::class, 'store']);

        // Applications for a specific job (employer)
        Route::get('/{id}/applications', [ApplicationController::class, 'forJob']);
        Route::get('/{id}/applied',      [ApplicationController::class, 'checkApplied']);
    });

    // Applications
    Route::prefix('applications')->group(function () {
        Route::post('/',  [ApplicationController::class, 'store']);
        Route::get('/me', [ApplicationController::class, 'myApplications']);
    });
});