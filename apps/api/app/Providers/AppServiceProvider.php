<?php

namespace App\Providers;

use App\Application\AI\AiProvider;
use App\Infrastructure\AI\FakeAiProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AiProvider::class, FakeAiProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('register', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));
        RateLimiter::for('login', fn (Request $request) => Limit::perMinute(5)->by($this->emailKey($request)));
        RateLimiter::for('password-email', fn (Request $request) => Limit::perMinute(3)->by($this->emailKey($request)));
        RateLimiter::for('password-reset', fn (Request $request) => Limit::perMinute(5)->by($this->emailKey($request)));
        RateLimiter::for('verification', fn (Request $request) => Limit::perMinute(3)->by((string) optional($request->user())->getAuthIdentifier().'|'.$request->ip()));
    }

    private function emailKey(Request $request): string
    {
        return Str::lower(trim((string) $request->input('email'))).'|'.$request->ip();
    }
}
