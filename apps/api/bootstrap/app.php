<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(fn (Request $request): bool => $request->is('api/*'));
        $exceptions->render(function (AuthenticationException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'type' => 'about:blank',
                'title' => 'Unauthenticated',
                'status' => 401,
                'detail' => 'Authentication is required for this request.',
            ], 401, ['Content-Type' => 'application/problem+json']);
        });
        $exceptions->render(function (HttpExceptionInterface $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $status = $exception->getStatusCode();

            return response()->json([
                'type' => 'about:blank',
                'title' => match ($status) {
                    403 => 'Forbidden',
                    404 => 'Not found',
                    429 => 'Too many requests',
                    default => 'Request failed',
                },
                'status' => $status,
                'detail' => $status >= 500 ? 'An unexpected error occurred.' : ($exception->getMessage() ?: 'The request could not be completed.'),
            ], $status, ['Content-Type' => 'application/problem+json']);
        });
    })->create();
