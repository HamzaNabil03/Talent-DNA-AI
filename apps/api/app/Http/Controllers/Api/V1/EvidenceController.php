<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ReplaceEvidenceFileRequest;
use App\Http\Requests\Api\V1\StoreEvidenceRequest;
use App\Http\Requests\Api\V1\UpdateEvidenceRequest;
use App\Models\AnalysisInput;
use App\Models\AnalysisRun;
use App\Models\Evidence;
use App\Models\Project;
use App\Models\TalentDnaSnapshotSkill;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class EvidenceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => $user->evidence()->latest()->get()->map(fn (Evidence $evidence): array => $this->serialize($evidence)),
            'limits' => $this->limits(),
        ]);
    }

    public function store(StoreEvidenceRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        abort_if($user->evidence()->count() >= config('evidence.max_items_per_user'), 422, 'The temporary evidence item limit has been reached.');
        $validated = $request->validated();
        $this->assertProjectOwnership($user, $validated['project_id'] ?? null);

        $disk = null;
        $path = null;
        try {
            $attributes = [
                'project_id' => $validated['project_id'] ?? null,
                'title' => $validated['title'],
                'type' => $validated['type'],
                'description' => $validated['description'] ?? null,
                'context' => $validated['context'] ?? null,
                'link_url' => $validated['type'] === 'link' ? $validated['link_url'] : null,
                'upload_status' => $validated['type'] === 'file' ? 'uploaded' : 'not_applicable',
                'validation_status' => $validated['type'] === 'file' ? 'type_and_size_validated' : 'link_saved_unread',
                'read_status' => 'not_read',
                'analysis_status' => 'not_analyzed',
            ];

            if ($validated['type'] === 'file') {
                /** @var UploadedFile $file */
                $file = $request->file('file');
                $disk = (string) config('evidence.disk');
                $extension = Str::lower($file->extension());
                $path = $file->storeAs("users/{$user->id}", Str::uuid().'.'.$extension, $disk);
                abort_unless(is_string($path), 500, 'The evidence file could not be stored.');
                $attributes += [
                    'original_filename' => $this->safeOriginalName($file, $extension),
                    'mime_type' => $file->getMimeType(),
                    'size_bytes' => $file->getSize(),
                    'storage_disk' => $disk,
                    'storage_path' => $path,
                    'content_sha256' => hash_file('sha256', $file->getRealPath()),
                ];
            }

            $evidence = $user->evidence()->create($attributes);
        } catch (Throwable $exception) {
            if ($disk && $path) {
                Storage::disk($disk)->delete($path);
            }
            throw $exception;
        }

        $profile = $user->profile()->firstOrCreate();
        $profile->update(['current_step' => max($profile->current_step, 4)]);

        return response()->json(['data' => $this->serialize($evidence), 'limits' => $this->limits()], 201);
    }

    public function show(Request $request, Evidence $evidence): JsonResponse
    {
        Gate::authorize('view', $evidence);

        return response()->json(['data' => $this->serialize($evidence)]);
    }

    public function update(UpdateEvidenceRequest $request, Evidence $evidence): JsonResponse
    {
        Gate::authorize('update', $evidence);
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validated();
        if (array_key_exists('project_id', $validated)) {
            $this->assertProjectOwnership($user, $validated['project_id']);
        }
        if ($evidence->type !== 'link') {
            unset($validated['link_url']);
        } elseif (array_key_exists('link_url', $validated)) {
            $validated['validation_status'] = 'link_saved_unread';
            $validated['read_status'] = 'not_read';
            $validated['analysis_status'] = 'not_analyzed';
        }
        $evidence->update($validated);

        return response()->json(['data' => $this->serialize($evidence->refresh())]);
    }

    public function replaceFile(ReplaceEvidenceFileRequest $request, Evidence $evidence): JsonResponse
    {
        Gate::authorize('update', $evidence);
        abort_unless($evidence->type === 'file', 422, 'Only file evidence can have its file replaced.');
        /** @var UploadedFile $file */
        $file = $request->file('file');
        $disk = (string) config('evidence.disk');
        $extension = Str::lower($file->extension());
        $newPath = $file->storeAs("users/{$evidence->user_id}", Str::uuid().'.'.$extension, $disk);
        abort_unless(is_string($newPath), 500, 'The replacement file could not be stored.');
        $oldDisk = $evidence->storage_disk;
        $oldPath = $evidence->storage_path;

        try {
            $evidence->update([
                'original_filename' => $this->safeOriginalName($file, $extension),
                'mime_type' => $file->getMimeType(),
                'size_bytes' => $file->getSize(),
                'storage_disk' => $disk,
                'storage_path' => $newPath,
                'upload_status' => 'uploaded',
                'validation_status' => 'type_and_size_validated',
                'read_status' => 'not_read',
                'analysis_status' => 'not_analyzed',
                'content_version' => $evidence->content_version + 1,
                'content_sha256' => hash_file('sha256', $file->getRealPath()),
            ]);
        } catch (Throwable $exception) {
            Storage::disk($disk)->delete($newPath);
            throw $exception;
        }

        if ($oldDisk && $oldPath) {
            Storage::disk($oldDisk)->delete($oldPath);
        }

        return response()->json(['data' => $this->serialize($evidence->refresh())]);
    }

    public function download(Request $request, Evidence $evidence): StreamedResponse
    {
        Gate::authorize('view', $evidence);
        abort_unless($evidence->type === 'file' && $evidence->storage_disk && $evidence->storage_path, 404);
        abort_unless(Storage::disk($evidence->storage_disk)->exists($evidence->storage_path), 404);

        return Storage::disk($evidence->storage_disk)->download(
            $evidence->storage_path,
            $evidence->original_filename ?? 'evidence',
            [
                'Content-Type' => 'application/octet-stream',
                'X-Content-Type-Options' => 'nosniff',
            ],
        );
    }

    public function destroy(Request $request, Evidence $evidence): JsonResponse
    {
        Gate::authorize('delete', $evidence);
        /** @var User $user */
        $user = $request->user();
        $disk = $evidence->storage_disk;
        $path = $evidence->storage_path;
        if ($disk && $path) {
            Storage::disk($disk)->delete($path);
        }
        $runIds = AnalysisInput::query()->where('evidence_id', $evidence->id)->pluck('analysis_run_id');
        AnalysisRun::query()->whereIn('id', $runIds)->doesntHave('snapshot')->delete();
        AnalysisInput::query()->where('evidence_id', $evidence->id)->update([
            'extracted_text' => null,
            'status' => 'source_deleted',
            'error_code' => 'source_deleted',
            'error_message' => 'The source evidence was deleted by its owner.',
        ]);
        TalentDnaSnapshotSkill::query()->whereHas('snapshot', fn ($query) => $query->whereIn('analysis_run_id', $runIds))->get()->each(function (TalentDnaSnapshotSkill $skill) use ($evidence): void {
            $skill->update(['references' => collect($skill->references)->map(function (array $reference) use ($evidence): array {
                if (($reference['evidence_id'] ?? null) !== $evidence->id) {
                    return $reference;
                }

                return [...$reference, 'quote' => null, 'observation' => null, 'source_deleted' => true];
            })->all()]);
        });
        $evidence->delete();
        if (! $user->evidence()->exists()) {
            $user->profile()->update(['input_completed_at' => null]);
        }

        return response()->json(null, 204);
    }

    private function assertProjectOwnership(User $user, ?int $projectId): void
    {
        if ($projectId === null) {
            return;
        }
        abort_unless(Project::query()->whereKey($projectId)->where('user_id', $user->id)->exists(), 422, 'The selected project is invalid.');
    }

    private function safeOriginalName(UploadedFile $file, string $extension): string
    {
        $name = basename(str_replace('\\', '/', $file->getClientOriginalName()));
        $name = preg_replace('/[\x00-\x1F\x7F]/u', '', $name) ?: "evidence.{$extension}";

        return Str::limit($name, 255, '');
    }

    /** @return array<string, mixed> */
    private function serialize(Evidence $evidence): array
    {
        return [
            'id' => $evidence->id,
            'project_id' => $evidence->project_id,
            'title' => $evidence->title,
            'type' => $evidence->type,
            'description' => $evidence->description,
            'context' => $evidence->context,
            'link_url' => $evidence->link_url,
            'original_filename' => $evidence->original_filename,
            'mime_type' => $evidence->mime_type,
            'size_bytes' => $evidence->size_bytes,
            'upload_status' => $evidence->upload_status,
            'validation_status' => $evidence->validation_status,
            'read_status' => $evidence->read_status,
            'analysis_status' => $evidence->analysis_status,
            'content_version' => $evidence->content_version,
            'download_url' => $evidence->type === 'file' ? "/api/v1/evidence/{$evidence->id}/download" : null,
            'created_at' => $evidence->created_at?->toAtomString(),
            'updated_at' => $evidence->updated_at?->toAtomString(),
        ];
    }

    /** @return array<string, mixed> */
    private function limits(): array
    {
        return [
            'max_items' => config('evidence.max_items_per_user'),
            'max_file_size_kb' => config('evidence.max_file_size_kb'),
            'allowed_extensions' => config('evidence.allowed_extensions'),
            'temporary' => true,
        ];
    }
}
