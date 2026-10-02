<?php

namespace App\Domain\Profiles;

enum ProfileField: string
{
    case Web = 'web';
    case English = 'english';
    case Marketing = 'marketing';
    case BusinessAdministration = 'business_administration';
}
