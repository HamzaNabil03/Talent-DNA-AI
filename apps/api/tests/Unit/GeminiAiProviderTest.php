<?php

namespace Tests\Unit;

use App\Infrastructure\AI\GeminiAiProvider;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiAiProviderTest extends TestCase
{
    public function test_it_uses_current_stateless_interactions_shape_and_parses_model_output_steps(): void
    {
        config()->set('ai.gemini.api_key', 'test-key');
        config()->set('ai.gemini.model', 'gemini-3.8-flash');
        config()->set('ai.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');

        Http::fake([
            'https://generativelanguage.googleapis.com/v1beta/interactions' => Http::response([
                'status' => 'completed',
                'steps' => [[
                    'type' => 'model_output',
                    'content' => [[
                        'type' => 'text',
                        'text' => json_encode(['suggestions' => [[
                            'skill_key' => 'html',
                            'skill_name' => 'HTML',
                            'within_assessment_scope' => true,
                            'rationale' => 'Semantic markup is present.',
                            'references' => [['evidence_id' => 7, 'kind' => 'line', 'start' => 1, 'end' => 1, 'quote' => '<main>', 'observation' => null]],
                            'limitations' => [],
                        ]]], JSON_THROW_ON_ERROR),
                    ]],
                ]],
                'usage' => ['total_tokens' => 42],
            ]),
        ]);

        $result = (new GeminiAiProvider)->extract([
            'evidence' => [['evidence_id' => 7, 'content' => 'L1: <main>']],
            'visual_parts' => [],
        ]);

        $this->assertSame('HTML', $result['suggestions'][0]['skill_name']);
        $this->assertSame(42, $result['usage']['total_tokens']);

        Http::assertSent(function (Request $request): bool {
            $payload = $request->data();

            return $request->url() === 'https://generativelanguage.googleapis.com/v1beta/interactions'
                && $request->hasHeader('x-goog-api-key', 'test-key')
                && ($payload['model'] ?? null) === 'gemini-3.8-flash'
                && ($payload['store'] ?? null) === false
                && is_string($payload['system_instruction'] ?? null)
                && ($payload['input'][0]['type'] ?? null) === 'text'
                && ! isset($payload['input'][0]['role'])
                && ($payload['response_format']['mime_type'] ?? null) === 'application/json';
        });
    }
}
