<?php

namespace Tests\Feature;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class TrustedProxyTest extends TestCase
{
    public function test_forwarded_https_is_used_for_absolute_verification_urls(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.10'])
            ->withHeaders([
                'X-Forwarded-Host' => 'talent-dna.example.test',
                'X-Forwarded-Proto' => 'https',
            ])
            ->getJson('/api/v1/health')
            ->assertOk();

        $this->assertTrue(app(Request::class)->isSecure());

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => 1, 'hash' => sha1('student@example.test')],
        );

        $this->assertStringStartsWith(
            'https://talent-dna.example.test/api/v1/auth/email/verify/',
            $url,
        );
    }
}
