<?php

namespace App\Application\Identity;

use App\Domain\Consent\ConsentType;
use App\Domain\Identity\NextStep;
use App\Domain\Identity\UserRole;
use App\Models\User;

final class AuthState
{
    /** @return array<string, mixed> */
    public function for(?User $user): array
    {
        if ($user === null) {
            return [
                'authenticated' => false,
                'user' => null,
                'email_verified' => false,
                'consents' => ['terms' => false, 'privacy' => false, 'ai_processing' => false],
                'next_step' => null,
                'profile' => null,
            ];
        }

        $versions = config('consent.versions');
        $accepted = $user->consents()
            ->whereIn('version', array_values($versions))
            ->pluck('version')
            ->all();

        $consents = [
            'terms' => in_array($versions[ConsentType::Terms->value], $accepted, true),
            'privacy' => in_array($versions[ConsentType::Privacy->value], $accepted, true),
            'ai_processing' => in_array($versions[ConsentType::AiProcessing->value], $accepted, true),
        ];

        $profile = $user->profile()->firstOrCreate();
        $latestAnalysis = $user->analysisRuns()->latest()->first();
        $nextStep = match (true) {
            $user->roleEnum() === UserRole::Admin => NextStep::Admin,
            ! $user->hasVerifiedEmail() => NextStep::VerifyEmail,
            ! $consents['ai_processing'] => NextStep::Consent,
            $user->talentDnaSnapshots()->exists() => NextStep::Dna,
            in_array($latestAnalysis?->status, ['ready', 'partial'], true) => NextStep::SkillReview,
            $latestAnalysis !== null => NextStep::Analysis,
            $profile->input_completed_at !== null => NextStep::ProfileReview,
            default => NextStep::ProfileSetup,
        };

        return [
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roleEnum()->value,
            ],
            'email_verified' => $user->hasVerifiedEmail(),
            'consents' => $consents,
            'next_step' => $nextStep->value,
            'profile' => [
                'current_step' => $profile->current_step,
                'input_complete' => $profile->input_completed_at !== null,
            ],
        ];
    }
}
