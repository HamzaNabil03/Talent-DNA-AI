<?php

namespace Tests\Feature;

use App\Application\AI\AiProvider;
use App\Domain\Consent\ConsentType;
use App\Models\Evidence;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class ProfileProjectEvidenceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('evidence');
        config(['evidence.disk' => 'evidence']);
        $this->withHeaders([
            'Origin' => 'http://localhost',
            'Referer' => 'http://localhost/builder/direction',
            'Accept' => 'application/json',
        ]);
    }

    public function test_each_user_gets_exactly_one_profile(): void
    {
        $user = User::factory()->create();

        $this->assertDatabaseHas('profiles', ['user_id' => $user->id, 'current_step' => 1]);
        $this->expectException(QueryException::class);
        Profile::query()->create(['user_id' => $user->id]);
    }

    public function test_partial_draft_can_be_resumed_and_server_validates_completion(): void
    {
        $user = $this->productUser();

        $this->actingAs($user)->patchJson('/api/v1/profile/direction', [
            'field' => 'web',
            'career_direction' => 'Frontend development',
        ])->assertOk()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.current_step', 2);

        $this->postJson('/api/v1/profile/complete')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['vision', 'projects', 'evidence']);

        $projectId = $this->postJson('/api/v1/projects', [
            'title' => 'Accessible portfolio',
            'description' => 'A real project',
            'contribution' => 'Built the interface',
            'role' => null,
            'tools' => ['React'],
            'outcome' => 'Published a usable prototype',
            'project_date' => '2026-09-01',
            'is_team' => false,
        ])->assertCreated()->json('data.id');

        $this->postJson('/api/v1/evidence', [
            'project_id' => $projectId,
            'title' => 'Repository link',
            'type' => 'link',
            'link_url' => 'https://example.com/repository',
        ])->assertCreated()->assertJsonPath('data.read_status', 'not_read');

        $this->patchJson('/api/v1/profile/vision', [
            'vision' => 'Build accessible products.',
            'strengths' => ['Problem solving'],
        ])->assertOk();

        $this->postJson('/api/v1/profile/complete')
            ->assertOk()->assertJsonPath('data.status', 'input_complete');
        $this->getJson('/api/v1/auth/session')
            ->assertOk()->assertJsonPath('next_step', 'profile_review');

        $this->postJson('/api/v1/auth/logout')->assertNoContent();
        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertOk()->assertJsonPath('next_step', 'profile_review');
        $this->getJson('/api/v1/profile')
            ->assertOk()
            ->assertJsonPath('data.career_direction', 'Frontend development')
            ->assertJsonPath('data.project_count', 1)
            ->assertJsonPath('data.evidence_count', 1);
    }

    public function test_project_crud_enforces_team_role_ownership_and_linked_evidence_policy(): void
    {
        $owner = $this->productUser();
        $other = $this->productUser();
        $this->actingAs($owner);

        $this->postJson('/api/v1/projects', [
            'title' => 'Team project',
            'is_team' => true,
        ])->assertUnprocessable()->assertJsonValidationErrors('role');

        $projectId = $this->postJson('/api/v1/projects', [
            'title' => 'Team project',
            'is_team' => true,
            'role' => 'Frontend lead',
            'tools' => [],
        ])->assertCreated()->json('data.id');

        $this->putJson("/api/v1/projects/{$projectId}", [
            'title' => 'Updated team project',
            'is_team' => true,
            'role' => 'UI developer',
            'tools' => ['TypeScript'],
        ])->assertOk()->assertJsonPath('data.title', 'Updated team project');

        $this->actingAs($other)->getJson("/api/v1/projects/{$projectId}")->assertForbidden();
        $this->putJson("/api/v1/projects/{$projectId}", [
            'title' => 'Attack', 'is_team' => false,
        ])->assertForbidden();

        $this->actingAs($owner)->postJson('/api/v1/evidence', [
            'project_id' => $projectId,
            'title' => 'Project link',
            'type' => 'link',
            'link_url' => 'https://example.com/project',
        ])->assertCreated();
        $this->deleteJson("/api/v1/projects/{$projectId}")
            ->assertStatus(409)
            ->assertJsonPath('title', 'Project has linked evidence');
        $this->assertDatabaseHas('projects', ['id' => $projectId]);
        $this->assertDatabaseHas('evidence', ['project_id' => $projectId]);
    }

    public function test_private_upload_validation_download_and_owner_isolation(): void
    {
        $owner = $this->productUser();
        $other = $this->productUser();
        $this->actingAs($owner);

        $response = $this->post('/api/v1/evidence', [
            'title' => 'Project report',
            'type' => 'file',
            'file' => UploadedFile::fake()->create('report.pdf', 120, 'application/pdf'),
        ], ['Accept' => 'application/json']);
        $response->assertCreated()
            ->assertJsonPath('data.upload_status', 'uploaded')
            ->assertJsonPath('data.validation_status', 'type_and_size_validated')
            ->assertJsonPath('data.read_status', 'not_read')
            ->assertJsonPath('data.analysis_status', 'not_analyzed')
            ->assertJsonMissingPath('data.storage_path')
            ->assertJsonMissingPath('data.storage_disk');

        $evidence = Evidence::query()->findOrFail($response->json('data.id'));
        Storage::disk('evidence')->assertExists($evidence->storage_path);
        $this->get($response->json('data.download_url'))->assertOk();

        $oldPath = $evidence->storage_path;
        $this->post("/api/v1/evidence/{$evidence->id}/file", [
            'file' => UploadedFile::fake()->create('replacement.pdf', 80, 'application/pdf'),
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.original_filename', 'replacement.pdf')
            ->assertJsonPath('data.read_status', 'not_read');
        $evidence->refresh();
        Storage::disk('evidence')->assertMissing($oldPath);
        Storage::disk('evidence')->assertExists($evidence->storage_path);

        $this->post('/api/v1/evidence', [
            'title' => 'Executable',
            'type' => 'file',
            'file' => UploadedFile::fake()->create('payload.exe', 10, 'application/x-msdownload'),
        ], ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors('file');

        $this->post('/api/v1/evidence', [
            'title' => 'Oversized',
            'type' => 'file',
            'file' => UploadedFile::fake()->create('large.pdf', 11000, 'application/pdf'),
        ], ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors('file');

        $this->actingAs($other)->getJson("/api/v1/evidence/{$evidence->id}")->assertForbidden();
        $this->get("/api/v1/evidence/{$evidence->id}/download")->assertForbidden();
        $this->patchJson("/api/v1/evidence/{$evidence->id}", ['title' => 'Attack'])->assertForbidden();
        $this->deleteJson("/api/v1/evidence/{$evidence->id}")->assertForbidden();

        $this->actingAs($owner)->deleteJson("/api/v1/evidence/{$evidence->id}")->assertNoContent();
        Storage::disk('evidence')->assertMissing($evidence->storage_path);
    }

    public function test_product_routes_require_verification_and_consent(): void
    {
        $unverified = User::factory()->unverified()->create();
        $this->actingAs($unverified)->getJson('/api/v1/profile')->assertForbidden();

        $verified = User::factory()->create();
        $this->actingAs($verified)->getJson('/api/v1/profile')->assertForbidden();

        $this->getJson('/api/v1/profile')->assertForbidden();
    }

    public function test_profile_flows_do_not_invoke_ai_provider(): void
    {
        $provider = Mockery::mock(AiProvider::class);
        $provider->shouldNotReceive('extract');
        $this->app->instance(AiProvider::class, $provider);
        $user = $this->productUser();

        $this->actingAs($user)->getJson('/api/v1/profile')->assertOk();
        $this->patchJson('/api/v1/profile/direction', ['field' => 'marketing'])->assertOk();
    }

    private function productUser(): User
    {
        $user = User::factory()->create();
        $user->consents()->create([
            'type' => ConsentType::AiProcessing,
            'version' => config('consent.versions.ai_processing'),
            'accepted_at' => now(),
        ]);

        return $user;
    }
}
