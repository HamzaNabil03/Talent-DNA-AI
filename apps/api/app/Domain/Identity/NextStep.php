<?php

namespace App\Domain\Identity;

enum NextStep: string
{
    case VerifyEmail = 'verify_email';
    case Consent = 'consent';
    case ProfileSetup = 'profile_setup';
    case ProfileReview = 'profile_review';
    case Analysis = 'analysis';
    case SkillReview = 'skill_review';
    case Dna = 'dna';
    case Admin = 'admin';
}
