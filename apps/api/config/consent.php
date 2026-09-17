<?php

use App\Domain\Consent\ConsentType;

return [
    'versions' => [
        ConsentType::Terms->value => 'terms-v1',
        ConsentType::Privacy->value => 'privacy-v1',
        ConsentType::AiProcessing->value => 'ai-processing-v1',
    ],
];
