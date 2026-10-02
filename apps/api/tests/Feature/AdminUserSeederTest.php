<?php

namespace Tests\Feature;

use App\Domain\Identity\UserRole;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
use Tests\TestCase;

class AdminUserSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        foreach (['ADMIN_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'] as $key) {
            putenv($key);
            unset($_ENV[$key], $_SERVER[$key]);
        }
        parent::tearDown();
    }

    public function test_admin_seeder_requires_explicit_environment_and_is_idempotent(): void
    {
        $this->setEnvironment('ADMIN_NAME', 'Internal Admin');
        $this->setEnvironment('ADMIN_EMAIL', 'ADMIN@example.com');
        $this->setEnvironment('ADMIN_PASSWORD', 'secure-admin-password');

        $seeder = app(AdminUserSeeder::class);
        $seeder->run();
        $seeder->run();

        $this->assertDatabaseCount('users', 1);
        $admin = User::query()->firstOrFail();
        $this->assertSame('admin@example.com', $admin->email);
        $this->assertSame(UserRole::Admin, $admin->role);
        $this->assertTrue($admin->hasVerifiedEmail());
    }

    public function test_admin_seeder_fails_safely_without_credentials(): void
    {
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required');
        app(AdminUserSeeder::class)->run();
    }

    private function setEnvironment(string $key, string $value): void
    {
        putenv("{$key}={$value}");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}
