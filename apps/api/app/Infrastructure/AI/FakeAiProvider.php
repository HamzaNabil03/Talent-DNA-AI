<?php

namespace App\Infrastructure\AI;

use App\Application\AI\AiProvider;

final class FakeAiProvider implements AiProvider
{
    public function extract(array $input): array
    {
        ksort($input);

        return [
            'provider' => 'fake',
            'schema_version' => 'test-v1',
            'input' => $input,
            'suggestions' => [],
        ];
    }
}
