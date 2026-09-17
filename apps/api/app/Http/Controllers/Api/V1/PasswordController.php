<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordController extends Controller
{
    public function forgot(ForgotPasswordRequest $request): JsonResponse
    {
        app()->setLocale($request->validated('locale', 'ar'));
        Password::sendResetLink($request->safe()->only('email'));

        return response()->json(['status' => 'reset_link_processed']);
    }

    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        app()->setLocale($request->validated('locale', 'ar'));
        $status = Password::reset(
            $request->safe()->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
                event(new PasswordReset($user));
            },
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'type' => 'about:blank',
                'title' => 'Password reset failed',
                'status' => 422,
                'detail' => __($status),
            ], 422, ['Content-Type' => 'application/problem+json']);
        }

        return response()->json(['status' => 'password_reset']);
    }
}
