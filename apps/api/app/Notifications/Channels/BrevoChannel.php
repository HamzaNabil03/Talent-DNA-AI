<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class BrevoChannel
{
    public function send(object $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toBrevo')) {
            throw new RuntimeException('Notification does not define a toBrevo method.');
        }

        $apiKey = (string) config('services.brevo.key');

        if ($apiKey === '') {
            throw new RuntimeException('BREVO_API_KEY is not configured.');
        }

        /** @var array<string, mixed> $payload */
        $payload = $notification->toBrevo($notifiable);

        Http::acceptJson()
            ->withHeaders(['api-key' => $apiKey])
            ->connectTimeout(5)
            ->timeout(15)
            ->post('https://api.brevo.com/v3/smtp/email', $payload)
            ->throw();
    }
}
