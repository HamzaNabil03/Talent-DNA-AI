<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Profiles\ProfileField;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateDirectionRequest;
use App\Http\Requests\Api\V1\UpdateVisionRequest;
use App\Models\Profile;
use App\Models\User;
use DateTimeInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $profile = $user->profile()->firstOrCreate();
        Gate::authorize('view', $profile);

        return response()->json(['data' => $this->serialize($profile, $user)]);
    }

    public function direction(UpdateDirectionRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $profile = $user->profile()->firstOrCreate();
        Gate::authorize('update', $profile);
        $profile->fill($request->validated());
        $profile->current_step = max($profile->current_step, 2);
        if ($profile->input_completed_at && (! $profile->field || ! $profile->career_direction)) {
            $profile->input_completed_at = null;
        }
        $profile->save();

        return response()->json(['data' => $this->serialize($profile->refresh(), $user)]);
    }

    public function vision(UpdateVisionRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $profile = $user->profile()->firstOrCreate();
        Gate::authorize('update', $profile);
        $profile->fill($request->validated());
        $profile->current_step = max($profile->current_step, 4);
        if ($profile->input_completed_at && blank($profile->vision)) {
            $profile->input_completed_at = null;
        }
        $profile->save();

        return response()->json(['data' => $this->serialize($profile->refresh(), $user)]);
    }

    public function complete(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $profile = $user->profile()->firstOrCreate();
        Gate::authorize('update', $profile);

        $errors = [];
        if (! $profile->field) {
            $errors['field'][] = 'Choose a field before completing your input.';
        }
        if (blank($profile->career_direction)) {
            $errors['career_direction'][] = 'Add your career direction before completing your input.';
        }
        if (blank($profile->vision)) {
            $errors['vision'][] = 'Add your view before completing your input.';
        }
        if (! $user->projects()->exists()) {
            $errors['projects'][] = 'Add at least one project before completing your input.';
        }
        if (! $user->evidence()->exists()) {
            $errors['evidence'][] = 'Add at least one evidence item before completing your input.';
        }

        if ($errors !== []) {
            return response()->json([
                'message' => 'The profile input is incomplete.',
                'errors' => $errors,
            ], 422);
        }

        $profile->forceFill(['current_step' => 4, 'input_completed_at' => now()])->save();

        return response()->json(['data' => $this->serialize($profile->refresh(), $user)]);
    }

    /** @return array<string, mixed> */
    private function serialize(Profile $profile, User $user): array
    {
        $field = $profile->getAttribute('field');
        $completedAt = $profile->getAttribute('input_completed_at');

        return [
            'id' => $profile->id,
            'name' => $user->name,
            'field' => $field instanceof ProfileField ? $field->value : null,
            'current_stage' => $profile->current_stage,
            'career_direction' => $profile->career_direction,
            'professional_interest' => $profile->professional_interest,
            'vision' => $profile->vision,
            'strengths' => $profile->strengths ?? [],
            'current_step' => $profile->current_step,
            'status' => $profile->input_completed_at ? 'input_complete' : 'draft',
            'input_completed_at' => $completedAt instanceof DateTimeInterface ? $completedAt->format(DATE_ATOM) : null,
            'project_count' => $user->projects()->count(),
            'evidence_count' => $user->evidence()->count(),
            'updated_at' => $profile->updated_at?->toAtomString(),
        ];
    }
}
