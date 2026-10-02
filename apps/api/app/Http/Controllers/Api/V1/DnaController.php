<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TalentDnaSnapshot;
use App\Models\TalentDnaSnapshotSkill;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DnaController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $snapshot = $user->talentDnaSnapshots()->with('skills')->latest('version')->first();

        return response()->json(['data' => $snapshot ? self::serializeSnapshot($snapshot) : null]);
    }

    public function skill(Request $request, TalentDnaSnapshotSkill $snapshotSkill): JsonResponse
    {
        $snapshotSkill->load('snapshot');
        abort_unless($snapshotSkill->snapshot->user_id === $request->user()->id, 404);

        return response()->json(['data' => self::serializeSkill($snapshotSkill)]);
    }

    /** @return array<string, mixed> */
    public static function serializeSnapshot(TalentDnaSnapshot $snapshot): array
    {
        return ['id' => $snapshot->id, 'version' => $snapshot->version, 'confirmed_at' => $snapshot->confirmed_at->toAtomString(), 'skills' => $snapshot->skills->map(fn ($skill) => self::serializeSkill($skill))->values()];
    }

    /** @return array<string, mixed> */
    private static function serializeSkill(TalentDnaSnapshotSkill $skill): array
    {
        return ['id' => $skill->id, 'skill_key' => $skill->skill_key, 'skill_name' => $skill->skill_name, 'within_assessment_scope' => $skill->within_assessment_scope, 'assessment_status' => $skill->assessment_status, 'rationale' => $skill->rationale, 'references' => $skill->references, 'limitations' => $skill->limitations];
    }
}
