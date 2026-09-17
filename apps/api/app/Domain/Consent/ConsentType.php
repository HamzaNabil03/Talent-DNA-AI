<?php

namespace App\Domain\Consent;

enum ConsentType: string
{
    case Terms = 'terms';
    case Privacy = 'privacy';
    case AiProcessing = 'ai_processing';
}
