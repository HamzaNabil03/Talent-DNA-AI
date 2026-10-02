<?php

namespace Tests\Feature;

use App\Application\Analysis\SuggestionValidator;
use App\Domain\Consent\ConsentType;
use App\Jobs\ProcessEvidenceAnalysis;
use App\Models\AnalysisRun;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EvidenceAnalysisTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('evidence');
        config(['evidence.disk' => 'evidence']);
        $this->withHeaders(['Origin' => 'http://localhost', 'Referer' => 'http://localhost/analysis', 'Accept' => 'application/json']);
    }

    public function test_analysis_is_explicit_queued_idempotent_and_creates_a_versioned_snapshot(): void
    {
        Queue::fake();
        $user = $this->productUser();
        $this->actingAs($user)->post('/api/v1/evidence', [
            'title' => 'Portfolio source',
            'type' => 'file',
            'file' => UploadedFile::fake()->createWithContent('portfolio.txt', '<main>Portfolio</main>'),
        ])->assertCreated();

        $response = $this->postJson('/api/v1/analysis')->assertAccepted()->assertJsonPath('data.status', 'queued');
        $runId = $response->json('data.id');
        Queue::assertPushed(ProcessEvidenceAnalysis::class, fn ($job): bool => $job->analysisRunId === $runId);
        $this->postJson('/api/v1/analysis')->assertOk()->assertJsonPath('data.id', $runId);

        app()->call([new ProcessEvidenceAnalysis($runId), 'handle']);
        $suggestionId = $this->getJson('/api/v1/analysis/current')->assertOk()->assertJsonPath('data.status', 'ready')->assertJsonPath('data.suggestions.0.skill_name', 'HTML')->json('data.suggestions.0.id');
        $body = ['suggestion_ids' => [$suggestionId], 'idempotency_key' => 'confirm-one'];
        $this->postJson("/api/v1/analysis/{$runId}/confirm", $body)->assertCreated()->assertJsonPath('data.version', 1)->assertJsonPath('data.skills.0.assessment_status', 'not_assessed');
        $this->postJson("/api/v1/analysis/{$runId}/confirm", $body)->assertCreated()->assertJsonPath('data.version', 1);
        $this->getJson('/api/v1/dna')->assertOk()->assertJsonCount(1, 'data.skills');
    }

    public function test_confirmation_rejects_stale_evidence_and_cross_user_access(): void
    {
        $owner = $this->productUser();
        $other = $this->productUser();
        $evidence = $owner->evidence()->create(['title' => 'Sample', 'type' => 'file', 'original_filename' => 'sample.txt', 'mime_type' => 'text/plain', 'size_bytes' => 4, 'storage_disk' => 'evidence', 'storage_path' => 'users/1/sample.txt', 'content_version' => 1, 'content_sha256' => hash('sha256', 'test'), 'upload_status' => 'uploaded', 'validation_status' => 'type_and_size_validated', 'read_status' => 'read', 'analysis_status' => 'analyzed']);
        $run = $owner->analysisRuns()->create(['status' => 'ready', 'progress' => 100, 'input_fingerprint' => hash('sha256', 'one')]);
        $run->inputs()->create(['evidence_id' => $evidence->id, 'evidence_version' => 1, 'evidence_sha256' => $evidence->content_sha256, 'source_type' => 'txt', 'extracted_text' => 'L1: test', 'reference_map' => ['kind' => 'line', 'max' => 1], 'status' => 'read']);
        $suggestion = $run->suggestions()->create(['skill_key' => 'html', 'skill_name' => 'HTML', 'within_assessment_scope' => true, 'rationale' => 'Supported', 'references' => [['evidence_id' => $evidence->id, 'kind' => 'line', 'start' => 1, 'end' => 1, 'quote' => 'test', 'observation' => null]], 'limitations' => []]);
        $evidence->update(['content_version' => 2]);

        $this->actingAs($other)->postJson("/api/v1/analysis/{$run->id}/confirm", ['suggestion_ids' => [$suggestion->id], 'idempotency_key' => 'other'])->assertNotFound();
        $this->actingAs($owner)->postJson("/api/v1/analysis/{$run->id}/confirm", ['suggestion_ids' => [$suggestion->id], 'idempotency_key' => 'stale'])->assertConflict();
        $this->assertSame('stale', AnalysisRun::findOrFail($run->id)->status);
    }

    public function test_backend_rejects_cv_only_and_visual_only_implementation_claims(): void
    {
        $user = $this->productUser();
        $evidence = $user->evidence()->create(['title' => 'My CV', 'type' => 'file', 'original_filename' => 'resume.txt', 'mime_type' => 'text/plain', 'size_bytes' => 20, 'storage_disk' => 'evidence', 'storage_path' => 'users/1/cv.txt', 'content_version' => 1, 'content_sha256' => hash('sha256', 'HTML developer'), 'upload_status' => 'uploaded', 'validation_status' => 'type_and_size_validated', 'read_status' => 'read', 'analysis_status' => 'analyzed']);
        $run = $user->analysisRuns()->create(['status' => 'ready', 'progress' => 100, 'input_fingerprint' => hash('sha256', 'cv')]);
        $input = $run->inputs()->create(['evidence_id' => $evidence->id, 'evidence_version' => 1, 'evidence_sha256' => $evidence->content_sha256, 'source_type' => 'txt', 'extracted_text' => 'L1: HTML developer', 'reference_map' => ['kind' => 'line', 'max' => 1], 'status' => 'read']);
        $input->load('evidence');
        $suggestion = ['skill_key' => 'html', 'skill_name' => 'HTML', 'rationale' => 'Claimed in CV', 'references' => [['evidence_id' => $evidence->id, 'kind' => 'line', 'start' => 1, 'end' => 1, 'quote' => 'HTML developer']], 'limitations' => []];

        $this->assertNull(app(SuggestionValidator::class)->validate($suggestion, [$evidence->id => $input]));

        $evidence->update(['title' => 'Portfolio screenshot', 'original_filename' => 'portfolio.png']);
        $input->update(['source_type' => 'image', 'extracted_text' => null, 'reference_map' => ['kind' => 'visual', 'max' => 1]]);
        $input->refresh()->load('evidence');
        $suggestion['references'] = [['evidence_id' => $evidence->id, 'kind' => 'visual', 'start' => 1, 'end' => 1, 'observation' => 'A web page is visible']];
        $this->assertNull(app(SuggestionValidator::class)->validate($suggestion, [$evidence->id => $input]));
    }

    private function productUser(): User
    {
        $user = User::factory()->create();
        $user->consents()->create(['type' => ConsentType::AiProcessing, 'version' => config('consent.versions.ai_processing'), 'accepted_at' => now()]);

        return $user;
    }
}
