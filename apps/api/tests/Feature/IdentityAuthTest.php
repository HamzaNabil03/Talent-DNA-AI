<?php

namespace Tests\Feature;

use App\Domain\Consent\ConsentType;
use App\Domain\Identity\UserRole;
use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class IdentityAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withHeaders([
            'Origin' => 'http://localhost',
            'Referer' => 'http://localhost/auth/sign-in',
            'Accept' => 'application/json',
        ]);
    }

    public function test_student_registration_is_transactional_and_sends_verification(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/auth/register', $this->registrationPayload([
            'email' => '  STUDENT@example.com ',
            'role' => 'admin',
        ]));

        $response->assertCreated()
            ->assertJsonPath('authenticated', true)
            ->assertJsonPath('user.email', 'student@example.com')
            ->assertJsonPath('user.role', 'student')
            ->assertJsonPath('next_step', 'verify_email')
            ->assertJsonMissingPath('user.password')
            ->assertJsonMissingPath('user.remember_token');

        $user = User::query()->where('email', 'student@example.com')->firstOrFail();
        $this->assertAuthenticatedAs($user);
        $this->assertSame(UserRole::Student, $user->role);
        $this->assertDatabaseHas('user_consents', ['user_id' => $user->id, 'type' => 'terms', 'version' => 'terms-v1']);
        $this->assertDatabaseHas('user_consents', ['user_id' => $user->id, 'type' => 'privacy', 'version' => 'privacy-v1']);
        $this->assertDatabaseCount('user_consents', 2);
        Notification::assertSentTo($user, VerifyEmailNotification::class);
    }

    public function test_registration_validation_rejects_duplicate_short_password_and_missing_consent(): void
    {
        User::factory()->create(['email' => 'used@example.com']);

        $this->postJson('/api/v1/auth/register', $this->registrationPayload(['email' => 'used@example.com']))
            ->assertUnprocessable()->assertJsonValidationErrors('email');
        $this->postJson('/api/v1/auth/register', $this->registrationPayload(['password' => 'short', 'password_confirmation' => 'short']))
            ->assertUnprocessable()->assertJsonValidationErrors('password');
        $this->postJson('/api/v1/auth/register', $this->registrationPayload(['accept_terms_and_privacy' => false]))
            ->assertUnprocessable()->assertJsonValidationErrors('accept_terms_and_privacy');
    }

    public function test_login_uses_a_generic_failure_and_returns_each_student_next_step(): void
    {
        $unverified = User::factory()->unverified()->create(['email' => 'new@example.com']);

        $this->postJson('/api/v1/auth/login', ['email' => $unverified->email, 'password' => 'wrong-password'])
            ->assertUnprocessable()
            ->assertJsonPath('detail', 'The provided credentials are invalid.')
            ->assertJsonMissing(['email' => $unverified->email]);

        $this->postJson('/api/v1/auth/login', ['email' => $unverified->email, 'password' => 'password'])
            ->assertOk()->assertJsonPath('next_step', 'verify_email');

        $verified = User::factory()->create(['email' => 'verified@example.com']);
        $this->postJson('/api/v1/auth/login', ['email' => $verified->email, 'password' => 'password'])
            ->assertOk()->assertJsonPath('next_step', 'consent');

        $verified->consents()->create([
            'type' => ConsentType::AiProcessing,
            'version' => 'ai-processing-v1',
            'accepted_at' => now(),
        ]);
        $this->postJson('/api/v1/auth/login', ['email' => $verified->email, 'password' => 'password'])
            ->assertOk()->assertJsonPath('next_step', 'profile_setup');
    }

    public function test_login_is_rate_limited_by_email_and_ip(): void
    {
        User::factory()->create(['email' => 'limited@example.com']);

        foreach (range(1, 5) as $attempt) {
            $this->postJson('/api/v1/auth/login', ['email' => 'limited@example.com', 'password' => 'wrong-'.$attempt])
                ->assertUnprocessable();
        }

        $this->postJson('/api/v1/auth/login', ['email' => 'limited@example.com', 'password' => 'wrong-final'])
            ->assertTooManyRequests();
    }

    public function test_signed_verification_is_idempotent_and_does_not_create_a_foreign_session(): void
    {
        Event::fake();
        $user = User::factory()->unverified()->create();
        $url = URL::temporarySignedRoute('verification.verify', now()->addMinutes(60), [
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification()),
        ]);

        $this->get($url)->assertRedirect('http://localhost:5173/auth/sign-in?verified=1');
        $this->assertTrue($user->refresh()->hasVerifiedEmail());
        $this->assertGuest();
        $this->get($url)->assertRedirect('http://localhost:5173/auth/sign-in?verified=1');
    }

    public function test_expired_and_invalid_verification_links_are_reported(): void
    {
        $user = User::factory()->unverified()->create();
        $expired = URL::temporarySignedRoute('verification.verify', now()->subMinute(), [
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification()),
        ]);

        $this->get($expired)->assertRedirect('http://localhost:5173/auth/verify-email?status=expired');
        $this->get("/api/v1/auth/email/verify/{$user->id}/invalid?expires=".(now()->timestamp + 60).'&signature=bad')
            ->assertRedirect('http://localhost:5173/auth/verify-email?status=invalid');
        $this->assertFalse($user->refresh()->hasVerifiedEmail());
    }

    public function test_verification_can_be_resent_and_already_verified_is_idempotent(): void
    {
        Notification::fake();
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)->postJson('/api/v1/auth/email/verification-notification')
            ->assertOk()->assertJsonPath('status', 'verification_link_sent');
        Notification::assertSentTo($user, VerifyEmailNotification::class);

        $user->markEmailAsVerified();
        $this->postJson('/api/v1/auth/email/verification-notification')
            ->assertOk()->assertJsonPath('status', 'already_verified');
    }

    public function test_only_verified_students_can_append_ai_consent_once(): void
    {
        $unverified = User::factory()->unverified()->create();
        $this->actingAs($unverified)->postJson('/api/v1/consents/ai-processing', ['accept_ai_processing' => true])
            ->assertForbidden();

        $student = User::factory()->create();
        $this->actingAs($student)->postJson('/api/v1/consents/ai-processing', [
            'accept_ai_processing' => true,
            'version' => 'attacker-version',
        ])->assertOk()->assertJsonPath('next_step', 'profile_setup');
        $this->postJson('/api/v1/consents/ai-processing', ['accept_ai_processing' => true])->assertOk();

        $this->assertDatabaseCount('user_consents', 1);
        $this->assertDatabaseHas('user_consents', [
            'user_id' => $student->id,
            'type' => 'ai_processing',
            'version' => 'ai-processing-v1',
        ]);

        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $this->actingAs($admin)->postJson('/api/v1/consents/ai-processing', ['accept_ai_processing' => true])
            ->assertForbidden();
    }

    public function test_logout_invalidates_the_session_and_session_response_is_safe(): void
    {
        $user = User::factory()->create(['email' => 'logout@example.com']);
        $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'password'])->assertOk();
        $this->getJson('/api/v1/auth/session')
            ->assertOk()->assertJsonPath('authenticated', true)
            ->assertJsonMissingPath('user.password');

        $this->postJson('/api/v1/auth/logout')->assertNoContent();
        $this->getJson('/api/v1/auth/session')
            ->assertOk()->assertJsonPath('authenticated', false)->assertJsonPath('user', null);
        $this->refreshApplication();
        $this->postJson('/api/v1/consents/ai-processing', ['accept_ai_processing' => true])->assertUnauthorized();
    }

    /** @param array<string, mixed> $overrides
     * @return array<string, mixed>
     */
    private function registrationPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Student Name',
            'email' => 'student@example.com',
            'password' => 'strong-password',
            'password_confirmation' => 'strong-password',
            'accept_terms_and_privacy' => true,
            'locale' => 'ar',
        ], $overrides);
    }
}
