<?php

namespace App\Jobs;

use App\Application\AI\AiProvider;
use App\Application\AI\AiProviderException;
use App\Application\Analysis\EvidenceReader;
use App\Application\Analysis\SuggestionValidator;
use App\Models\AnalysisRun;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use RuntimeException;
use Throwable;

class ProcessEvidenceAnalysis implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 180;

    public function __construct(public int $analysisRunId) {}

    /** @return list<int> */
    public function backoff(): array
    {
        return [30, 120];
    }

    public function handle(EvidenceReader $reader, AiProvider $provider, SuggestionValidator $validator): void
    {
        $run = AnalysisRun::query()->with('user.evidence')->findOrFail($this->analysisRunId);
        if (! in_array($run->status, ['queued', 'retrying'], true)) {
            return;
        }
        $run->update(['status' => 'processing', 'progress' => 10, 'started_at' => $run->started_at ?? now(), 'failure_code' => null, 'failure_message' => null]);
        $evidence = $run->user->evidence->where('type', 'file')->sortBy('id')->take((int) config('evidence.analysis.max_files'));
        $payload = [];
        $visualParts = [];
        $partial = $run->user->evidence->where('type', 'file')->count() > $evidence->count();
        try {
            foreach ($evidence as $item) {
                try {
                    $read = $reader->read($item);
                    $input = $run->inputs()->create(['evidence_id' => $item->id, 'evidence_version' => $item->content_version, 'evidence_sha256' => $item->content_sha256, 'source_type' => $read['source_type'], 'extracted_text' => $read['text'], 'reference_map' => $read['reference_map'], 'status' => 'read', 'is_partial' => $read['partial']]);
                    $payload[] = ['evidence_id' => $item->id, 'title' => $item->title, 'filename' => $item->original_filename, 'source_type' => $read['source_type'], 'reference_map' => $read['reference_map'], 'content' => $read['text'], 'warning' => $read['partial'] ? 'Content was truncated by a conservative limit.' : null];
                    if ($read['provider_part']) {
                        $visualParts[] = ['type' => 'text', 'text' => "The next visual belongs to evidence_id={$item->id}."];
                        $visualParts[] = $read['provider_part'];
                    }
                    $partial = $partial || $input->is_partial;
                } catch (RuntimeException $exception) {
                    $run->inputs()->create(['evidence_id' => $item->id, 'evidence_version' => $item->content_version, 'evidence_sha256' => $item->content_sha256, 'source_type' => 'unreadable', 'status' => 'failed', 'error_code' => 'unreadable_file', 'error_message' => $exception->getMessage(), 'is_partial' => true]);
                    $partial = true;
                }
            }
            if ($payload === []) {
                throw new RuntimeException('No readable uploaded evidence was available.');
            }
            $run->update(['progress' => 55, 'is_partial' => $partial]);
            $result = $provider->extract(['evidence' => $payload, 'visual_parts' => $visualParts]);
            $inputs = $run->inputs()->where('status', 'read')->get()->keyBy('evidence_id')->all();
            foreach (($result['suggestions'] ?? []) as $suggestion) {
                if (is_array($suggestion) && ($validated = $validator->validate($suggestion, $inputs))) {
                    $run->suggestions()->create($validated);
                }
            }
            $run->user->evidence()->whereIn('id', array_keys($inputs))->update(['read_status' => 'read', 'analysis_status' => 'analyzed']);
            $run->update(['status' => $partial ? 'partial' : 'ready', 'progress' => 100, 'provider' => $result['provider'] ?? config('ai.provider'), 'model' => $result['model'] ?? config('ai.gemini.model'), 'usage' => $result['usage'] ?? null, 'completed_at' => now()]);
        } catch (AiProviderException $exception) {
            if ($exception->transient && $this->attempts() < $this->tries) {
                $run->update(['status' => 'retrying', 'failure_code' => $exception->safeCode, 'failure_message' => $exception->getMessage()]);
                throw $exception;
            }
            $run->update(['status' => $exception->safeCode === 'provider_not_configured' ? 'not_configured' : 'failed', 'failure_code' => $exception->safeCode, 'failure_message' => $exception->getMessage(), 'completed_at' => now()]);
        } catch (Throwable $exception) {
            report($exception);
            $run->update(['status' => 'failed', 'failure_code' => $exception instanceof RuntimeException ? 'no_readable_evidence' : 'analysis_failed', 'failure_message' => $exception instanceof RuntimeException ? $exception->getMessage() : 'Analysis could not be completed safely.', 'completed_at' => now()]);
        }
    }
}
