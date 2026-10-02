<?php

namespace App\Application\Analysis;

use App\Models\AnalysisInput;
use Illuminate\Support\Str;

final class SuggestionValidator
{
    /**
     * @param  array<string, mixed>  $suggestion
     * @param  array<int, AnalysisInput>  $inputs
     * @return array<string, mixed>|null
     */
    public function validate(array $suggestion, array $inputs): ?array
    {
        $name = trim((string) ($suggestion['skill_name'] ?? ''));
        $rationale = trim((string) ($suggestion['rationale'] ?? ''));
        $references = $suggestion['references'] ?? null;
        if ($name === '' || $rationale === '' || ! is_array($references) || $references === []) {
            return null;
        }
        $aliases = ['html' => 'html', 'css' => 'css', 'javascript' => 'javascript', 'js' => 'javascript'];
        $rawKey = Str::lower(trim((string) ($suggestion['skill_key'] ?? $name)));
        $key = $aliases[$rawKey] ?? null;
        $validatedRefs = [];
        $hasNonClaimReference = false;
        $hasImplementationReference = false;
        foreach ($references as $reference) {
            if (! is_array($reference)) {
                return null;
            }
            $evidenceId = (int) ($reference['evidence_id'] ?? 0);
            $input = $inputs[$evidenceId] ?? null;
            if (! $input) {
                return null;
            }
            $kind = (string) ($reference['kind'] ?? '');
            $start = (int) ($reference['start'] ?? 0);
            $end = (int) ($reference['end'] ?? $start);
            $map = $input->reference_map ?? [];
            if ($kind !== ($map['kind'] ?? null) || $start < 1 || $end < $start || $end > (int) ($map['max'] ?? 0)) {
                return null;
            }
            $isVisual = in_array($kind, ['visual', 'page_visual'], true);
            $quote = trim((string) ($reference['quote'] ?? ''));
            $observation = trim((string) ($reference['observation'] ?? ''));
            if ($isVisual && $observation === '') {
                return null;
            }
            if (! $isVisual && ($quote === '' || ! str_contains($this->normalize((string) $input->extracted_text), $this->normalize($quote)))) {
                return null;
            }
            $sourceName = Str::lower(($input->evidence->title ?? '').' '.($input->evidence->original_filename ?? ''));
            $isClaimDocument = preg_match('/\b(cv|resume|curriculum vitae)\b|سير(?:ة|تي)/u', $sourceName) === 1;
            $hasNonClaimReference = $hasNonClaimReference || ! $isClaimDocument;
            $hasImplementationReference = $hasImplementationReference || (! $isClaimDocument && ! $isVisual && in_array($input->source_type, ['html', 'htm', 'css', 'js', 'txt', 'docx', 'pdf_text'], true));
            $validatedRefs[] = ['evidence_id' => $evidenceId, 'kind' => $kind, 'start' => $start, 'end' => $end, 'quote' => $isVisual ? null : $quote, 'observation' => $isVisual ? $observation : null];
        }
        if (! $hasNonClaimReference || ($key !== null && ! $hasImplementationReference)) {
            return null;
        }
        $limitations = array_values(array_filter(array_map('strval', is_array($suggestion['limitations'] ?? null) ? $suggestion['limitations'] : [])));

        return ['skill_key' => $key ?: ($rawKey !== '' ? Str::slug($rawKey, '_') : null), 'skill_name' => Str::limit($name, 255, ''), 'within_assessment_scope' => $key !== null, 'rationale' => $rationale, 'references' => $validatedRefs, 'limitations' => $limitations];
    }

    private function normalize(string $value): string
    {
        return Str::lower(preg_replace('/\s+/u', ' ', trim($value)) ?: '');
    }
}
