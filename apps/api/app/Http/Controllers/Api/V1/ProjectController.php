<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ProjectRequest;
use App\Models\Project;
use App\Models\User;
use DateTimeInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $projects = $user->projects()->withCount('evidence')->latest()->get();

        return response()->json(['data' => $projects->map(fn (Project $project): array => $this->serialize($project))]);
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $project = $user->projects()->create($request->validated());
        $profile = $user->profile()->firstOrCreate();
        $profile->update(['current_step' => max($profile->current_step, 3)]);

        return response()->json(['data' => $this->serialize($project->loadCount('evidence'))], 201);
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        return response()->json(['data' => $this->serialize($project->loadCount('evidence'))]);
    }

    public function update(ProjectRequest $request, Project $project): JsonResponse
    {
        Gate::authorize('update', $project);
        $project->update($request->validated());

        return response()->json(['data' => $this->serialize($project->refresh()->loadCount('evidence'))]);
    }

    public function destroy(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('delete', $project);
        $evidenceCount = $project->evidence()->count();
        if ($evidenceCount > 0) {
            return response()->json([
                'type' => 'about:blank',
                'title' => 'Project has linked evidence',
                'status' => 409,
                'detail' => "Remove or reassign the {$evidenceCount} linked evidence item(s) before deleting this project.",
            ], 409, ['Content-Type' => 'application/problem+json']);
        }

        /** @var User $user */
        $user = $request->user();
        $project->delete();
        if (! $user->projects()->exists()) {
            $user->profile()->update(['input_completed_at' => null]);
        }

        return response()->json(null, 204);
    }

    /** @return array<string, mixed> */
    private function serialize(Project $project): array
    {
        $projectDate = $project->getAttribute('project_date');

        return [
            'id' => $project->id,
            'title' => $project->title,
            'description' => $project->description,
            'contribution' => $project->contribution,
            'role' => $project->role,
            'tools' => $project->tools ?? [],
            'outcome' => $project->outcome,
            'project_date' => $projectDate instanceof DateTimeInterface ? $projectDate->format('Y-m-d') : null,
            'is_team' => $project->is_team,
            'evidence_count' => (int) ($project->evidence_count ?? $project->evidence()->count()),
            'created_at' => $project->created_at?->toAtomString(),
            'updated_at' => $project->updated_at?->toAtomString(),
        ];
    }
}
