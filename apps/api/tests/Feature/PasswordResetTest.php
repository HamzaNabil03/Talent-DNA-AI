<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withHeaders(['Origin' => 'http://localhost', 'Accept' => 'application/json']);
    }

    public function test_forgot_password_is_generic_for_existing_and_unknown_emails(): void
    {
        Notification::fake();
        $user = User::factory()->create(['email' => 'known@example.com']);

        $known = $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email, 'locale' => 'en']);
        $unknown = $this->postJson('/api/v1/auth/forgot-password', ['email' => 'unknown@example.com', 'locale' => 'en']);

        $known->assertOk()->assertExactJson(['status' => 'reset_link_processed']);
        $unknown->assertOk()->assertExactJson(['status' => 'reset_link_processed']);
        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    public function test_password_reset_is_one_time_and_requires_ten_characters(): void
    {
        $user = User::factory()->create(['password' => 'old-password']);
        $token = Password::createToken($user);

        $this->postJson('/api/v1/auth/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'short',
            'password_confirmation' => 'short',
        ])->assertUnprocessable()->assertJsonValidationErrors('password');

        $payload = [
            'email' => $user->email,
            'token' => $token,
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ];
        $this->postJson('/api/v1/auth/reset-password', $payload)
            ->assertOk()->assertExactJson(['status' => 'password_reset']);
        $this->assertTrue(Hash::check('new-secure-password', $user->refresh()->password));
        $this->postJson('/api/v1/auth/reset-password', $payload)->assertUnprocessable();
    }

    public function test_invalid_reset_token_is_rejected_without_being_returned(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/v1/auth/reset-password', [
            'email' => $user->email,
            'token' => 'invalid-secret-token',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])->assertUnprocessable()->assertJsonMissing(['token' => 'invalid-secret-token']);
    }
}
