<?php

namespace App\Providers;

use App\Application\AI\AiProvider;
use App\Infrastructure\AI\FakeAiProvider;
use App\Infrastructure\AI\GeminiAiProvider;
use App\Models\Evidence;
use App\Models\Profile;
use App\Models\Project;
use App\Policies\EvidencePolicy;
use App\Policies\ProfilePolicy;
use App\Policies\ProjectPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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
        $this->app->bind(
            AiProvider::class,
            $this->app->environment('testing') ? FakeAiProvider::class : GeminiAiProvider::class,
        );
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
        RateLimiter::for('evidence-upload', fn (Request $request) => Limit::perMinute(10)->by((string) optional($request->user())->getAuthIdentifier().'|'.$request->ip()));
        RateLimiter::for('analysis', fn (Request $request) => Limit::perMinute(3)->by((string) optional($request->user())->getAuthIdentifier().'|'.$request->ip()));

        Gate::policy(Profile::class, ProfilePolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Evidence::class, EvidencePolicy::class);
    }

    private function emailKey(Request $request): string
    {
        return Str::lower(trim((string) $request->input('email'))).'|'.$request->ip();
    }
}
