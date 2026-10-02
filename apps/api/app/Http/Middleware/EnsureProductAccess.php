<?php

namespace App\Http\Middleware;

use App\Domain\Consent\ConsentType;
use App\Domain\Identity\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProductAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        abort_unless($user && $user->roleEnum() === UserRole::Student, 403);
        abort_unless($user->hasVerifiedEmail(), 403, 'Email verification is required.');
        abort_unless(
            $user->consents()
                ->where('type', ConsentType::AiProcessing->value)
                ->where('version', config('consent.versions.ai_processing'))
                ->exists(),
            403,
            'AI processing consent is required.',
        );

        return $next($request);
    }
}
