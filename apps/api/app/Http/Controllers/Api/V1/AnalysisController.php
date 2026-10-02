<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessEvidenceAnalysis;
use App\Models\AnalysisRun;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalysisController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $evidence = $user->evidence()->where('type', 'file')->orderBy('id')->get();
        abort_if($evidence->isEmpty(), 422, 'Upload at least one supported private file before analysis.');
        $fingerprint = hash('sha256', $evidence->map(fn ($item): string => "{$item->id}:{$item->content_version}:{$item->content_sha256}")->implode('|'));
        $existing = $user->analysisRuns()->where('input_fingerprint', $fingerprint)->whereIn('status', ['queued', 'processing', 'retrying', 'ready', 'partial', 'not_configured'])->latest()->first();
        if ($existing) {
            return response()->json(['data' => $this->serialize($existing)]);
        }
        $configured = app()->environment('testing') || (string) config('ai.gemini.api_key') !== '';
        $run = $user->analysisRuns()->create(['status' => $configured ? 'queued' : 'not_configured', 'progress' => 0, 'input_fingerprint' => $fingerprint, 'provider' => config('ai.provider'), 'model' => config('ai.gemini.model'), 'failure_code' => $configured ? null : 'provider_not_configured', 'failure_message' => $configured ? null : 'Gemini is not configured. Add GEMINI_API_KEY on the server.']);
        if ($configured) {
            ProcessEvidenceAnalysis::dispatch($run->id);
        }

        return response()->json(['data' => $this->serialize($run)], 202);
    }

    public function current(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $run = $user->analysisRuns()->with(['inputs.evidence:id,title,original_filename', 'suggestions'])->latest()->first();

        return response()->json(['data' => $run ? $this->serialize($run) : null]);
    }

    public function confirm(Request $request, AnalysisRun $analysis): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        abort_unless($analysis->user_id === $user->id, 404);
        $validated = $request->validate(['suggestion_ids' => ['required', 'array', 'min:1'], 'suggestion_ids.*' => ['integer', 'distinct'], 'idempotency_key' => ['required', 'string', 'max:100']]);
        abort_unless(in_array($analysis->status, ['ready', 'partial'], true), 409, 'This analysis is not ready for confirmation.');
        $analysis->load(['inputs.evidence', 'suggestions']);
        foreach ($analysis->inputs as $input) {
            if (! $input->evidence || $input->evidence->content_version !== $input->evidence_version || $input->evidence->content_sha256 !== $input->evidence_sha256) {
                $analysis->update(['status' => 'stale', 'failure_code' => 'evidence_changed', 'failure_message' => 'Evidence changed after analysis. Start a new analysis.']);
                abort(409, 'Evidence changed after analysis. Start a new analysis.');
            }
        }
        $snapshot = DB::transaction(function () use ($analysis, $user, $validated) {
            $existing = $user->talentDnaSnapshots()->where('idempotency_key', $validated['idempotency_key'])->with('skills')->first();
            if ($existing) {
                return $existing;
            }
            $selected = $analysis->suggestions->whereIn('id', $validated['suggestion_ids']);
            abort_unless($selected->count() === count($validated['suggestion_ids']), 422, 'One or more selected suggestions are invalid.');
            $version = ((int) $user->talentDnaSnapshots()->lockForUpdate()->max('version')) + 1;
            $snapshot = $user->talentDnaSnapshots()->create(['analysis_run_id' => $analysis->id, 'version' => $version, 'idempotency_key' => $validated['idempotency_key'], 'confirmed_at' => now()]);
            foreach ($selected as $suggestion) {
                $snapshot->skills()->create($suggestion->only(['skill_key', 'skill_name', 'within_assessment_scope', 'rationale', 'references', 'limitations']) + ['analysis_suggestion_id' => $suggestion->id, 'assessment_status' => 'not_assessed']);
            }

            return $snapshot->load('skills');
        });

        return response()->json(['data' => DnaController::serializeSnapshot($snapshot)], 201);
    }

    /** @return array<string, mixed> */
    private function serialize(AnalysisRun $run): array
    {
        return ['id' => $run->id, 'status' => $run->status, 'progress' => $run->progress, 'is_partial' => $run->is_partial, 'provider' => $run->provider, 'model' => $run->model, 'failure_code' => $run->failure_code, 'failure_message' => $run->failure_message, 'suggestions' => $run->relationLoaded('suggestions') ? $run->suggestions->map(fn ($item) => ['id' => $item->id, 'skill_key' => $item->skill_key, 'skill_name' => $item->skill_name, 'within_assessment_scope' => $item->within_assessment_scope, 'rationale' => $item->rationale, 'references' => $item->references, 'limitations' => $item->limitations])->values() : [], 'inputs' => $run->relationLoaded('inputs') ? $run->inputs->map(fn ($item) => ['evidence_id' => $item->evidence_id, 'title' => $item->evidence?->title, 'filename' => $item->evidence?->original_filename, 'status' => $item->status, 'error_code' => $item->error_code, 'error_message' => $item->error_message, 'is_partial' => $item->is_partial])->values() : [], 'created_at' => $run->created_at?->toAtomString(), 'completed_at' => $run->completed_at?->toAtomString()];
    }
}
