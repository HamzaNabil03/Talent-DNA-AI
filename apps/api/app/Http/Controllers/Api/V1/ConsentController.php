<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Identity\AuthState;
use App\Domain\Consent\ConsentType;
use App\Domain\Identity\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConsentController extends Controller
{
    public function __construct(private readonly AuthState $authState) {}

    public function store(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        abort_unless($user->roleEnum() === UserRole::Student, 403);
        abort_unless($user->hasVerifiedEmail(), 403);

        $request->validate(['accept_ai_processing' => ['required', 'accepted']]);

        $user->consents()->firstOrCreate(
            [
                'type' => ConsentType::AiProcessing,
                'version' => config('consent.versions.ai_processing'),
            ],
            ['accepted_at' => now()],
        );

        return response()->json($this->authState->for($user->refresh()));
    }
}
