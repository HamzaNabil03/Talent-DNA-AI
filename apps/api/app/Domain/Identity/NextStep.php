<?php

namespace App\Domain\Identity;

enum NextStep: string
{
    case VerifyEmail = 'verify_email';
    case Consent = 'consent';
    case ProfileSetup = 'profile_setup';
    case Admin = 'admin';
}
