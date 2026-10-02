<?php

use App\Http\Controllers\Api\V1\AnalysisController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ConsentController;
use App\Http\Controllers\Api\V1\DnaController;
use App\Http\Controllers\Api\V1\EmailVerificationController;
use App\Http\Controllers\Api\V1\EvidenceController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\PasswordController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\ProjectController;
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

    Route::middleware(['auth:sanctum', 'product.access'])->group(function (): void {
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::patch('/profile/direction', [ProfileController::class, 'direction']);
        Route::patch('/profile/vision', [ProfileController::class, 'vision']);
        Route::post('/profile/complete', [ProfileController::class, 'complete']);

        Route::apiResource('projects', ProjectController::class);
        Route::get('/evidence', [EvidenceController::class, 'index']);
        Route::post('/evidence', [EvidenceController::class, 'store'])->middleware('throttle:evidence-upload');
        Route::get('/evidence/{evidence}', [EvidenceController::class, 'show']);
        Route::patch('/evidence/{evidence}', [EvidenceController::class, 'update']);
        Route::post('/evidence/{evidence}/file', [EvidenceController::class, 'replaceFile'])->middleware('throttle:evidence-upload');
        Route::get('/evidence/{evidence}/download', [EvidenceController::class, 'download'])->name('api.v1.evidence.download');
        Route::delete('/evidence/{evidence}', [EvidenceController::class, 'destroy']);
        Route::post('/analysis', [AnalysisController::class, 'store'])->middleware('throttle:analysis');
        Route::get('/analysis/current', [AnalysisController::class, 'current']);
        Route::post('/analysis/{analysis}/confirm', [AnalysisController::class, 'confirm']);
        Route::get('/dna', [DnaController::class, 'show']);
        Route::get('/dna/skills/{snapshotSkill}', [DnaController::class, 'skill']);
    });
});
