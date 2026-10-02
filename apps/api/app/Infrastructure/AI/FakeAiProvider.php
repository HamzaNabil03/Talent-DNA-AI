<?php

namespace App\Infrastructure\AI;

use App\Application\AI\AiProvider;

final class FakeAiProvider implements AiProvider
{
    public function extract(array $input): array
    {
        $evidence = $input['evidence'][0] ?? null;
        $suggestions = [];
        if (is_array($evidence) && isset($evidence['evidence_id']) && is_string($evidence['content'] ?? null)) {
            $suggestions[] = [
                'skill_key' => 'html',
                'skill_name' => 'HTML',
                'within_assessment_scope' => true,
                'rationale' => 'The uploaded work sample contains an HTML document structure.',
                'references' => [[
                    'evidence_id' => $evidence['evidence_id'],
                    'kind' => $evidence['reference_map']['kind'],
                    'start' => 1,
                    'end' => 1,
                    'quote' => '<main>Portfolio</main>',
                    'observation' => null,
                ]],
                'limitations' => ['This suggestion has not been assessed.'],
            ];
        }

        return [
            'provider' => 'fake',
            'schema_version' => 'test-v1',
            'model' => 'fake-test-model',
            'suggestions' => $suggestions,
        ];
    }
}
