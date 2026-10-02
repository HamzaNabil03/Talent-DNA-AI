<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailVerificationController extends Controller
{
    public function verify(Request $request, int $id, string $hash): RedirectResponse
    {
        $frontend = rtrim((string) config('app.frontend_url'), '/');
        $expired = (int) $request->query('expires', 0) < now()->timestamp;

        if (! $request->hasValidSignature()) {
            return redirect()->away($frontend.'/auth/verify-email?status='.($expired ? 'expired' : 'invalid'));
        }

        $user = User::query()->findOrFail($id);
        abort_unless(hash_equals($hash, sha1($user->getEmailForVerification())), 403);

        if (! $user->hasVerifiedEmail() && $user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        $sameSession = Auth::guard('web')->id() === $user->id;

        return redirect()->away($frontend.($sameSession ? '/onboarding/consent' : '/auth/sign-in?verified=1'));
    }

    public function resend(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        if ($user->hasVerifiedEmail()) {
            return response()->json(['status' => 'already_verified']);
        }

        app()->setLocale($request->session()->get('locale', 'ar'));
        $user->sendEmailVerificationNotification();

        return response()->json(['status' => 'verification_link_sent']);
    }
}
