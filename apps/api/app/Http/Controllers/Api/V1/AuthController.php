<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Identity\AuthState;
use App\Domain\Consent\ConsentType;
use App\Domain\Identity\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function __construct(private readonly AuthState $authState) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        app()->setLocale($validated['locale']);

        $user = DB::transaction(function () use ($validated): User {
            $user = User::query()->create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => UserRole::Student,
            ]);

            $now = now();
            $user->consents()->createMany([
                ['type' => ConsentType::Terms, 'version' => config('consent.versions.terms'), 'accepted_at' => $now],
                ['type' => ConsentType::Privacy, 'version' => config('consent.versions.privacy'), 'accepted_at' => $now],
            ]);

            return $user;
        });

        Auth::guard('web')->login($user);
        $request->session()->regenerate();
        $request->session()->put('locale', $validated['locale']);
        $user->sendEmailVerificationNotification();

        return response()->json($this->authState->for($user), 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::guard('web')->attempt($request->validated())) {
            return response()->json([
                'type' => 'about:blank',
                'title' => 'Authentication failed',
                'status' => 422,
                'detail' => 'The provided credentials are invalid.',
            ], 422, ['Content-Type' => 'application/problem+json']);
        }

        $request->session()->regenerate();
        /** @var User $user */
        $user = Auth::guard('web')->user();

        return response()->json($this->authState->for($user));
    }

    public function session(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::guard('web')->user();

        return response()->json($this->authState->for($user));
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(null, 204);
    }
}
