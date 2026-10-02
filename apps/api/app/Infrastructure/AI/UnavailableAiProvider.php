<?php

namespace App\Infrastructure\AI;

use App\Application\AI\AiProvider;
use LogicException;

final class UnavailableAiProvider implements AiProvider
{
    public function extract(array $input): array
    {
        throw new LogicException('AI analysis is not available in this release.');
    }
}
