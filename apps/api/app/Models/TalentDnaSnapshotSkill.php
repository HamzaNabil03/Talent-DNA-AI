<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string|null $skill_key
 * @property string $skill_name
 * @property bool $within_assessment_scope
 * @property string $assessment_status
 * @property string $rationale
 * @property array<int, array<string, mixed>> $references
 * @property array<int, string> $limitations
 * @property-read TalentDnaSnapshot $snapshot
 */
class TalentDnaSnapshotSkill extends Model
{
    protected $fillable = ['analysis_suggestion_id', 'skill_key', 'skill_name', 'within_assessment_scope', 'assessment_status', 'rationale', 'references', 'limitations'];

    protected function casts(): array
    {
        return ['within_assessment_scope' => 'boolean', 'references' => 'array', 'limitations' => 'array'];
    }

    /** @return BelongsTo<TalentDnaSnapshot, $this> */
    public function snapshot(): BelongsTo
    {
        return $this->belongsTo(TalentDnaSnapshot::class, 'talent_dna_snapshot_id');
    }
}
