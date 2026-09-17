<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ConsentController;
use App\Http\Controllers\Api\V1\EmailVerificationController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\PasswordController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', HealthController::class)->name('api.v1.health');

    Route::prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:register');
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
        Route::get('/session', [AuthController::class, 'session']);
        Route::post('/forgot-password', [PasswordController::class, 'forgot'])->middleware('throttle:password-email');
        Route::post('/reset-password', [PasswordController::class, 'reset'])->middleware('throttle:password-reset');

        Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->whereNumber('id')
            ->name('verification.verify');

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
                ->middleware('throttle:verification');
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });

    Route::post('/consents/ai-processing', [ConsentController::class, 'store'])
        ->middleware('auth:sanctum');
});
