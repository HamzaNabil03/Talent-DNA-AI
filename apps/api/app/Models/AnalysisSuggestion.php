<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string|null $skill_key
 * @property string $skill_name
 * @property bool $within_assessment_scope
 * @property string $rationale
 * @property array<int, array<string, mixed>> $references
 * @property array<int, string> $limitations
 */
class AnalysisSuggestion extends Model
{
    protected $fillable = ['skill_key', 'skill_name', 'within_assessment_scope', 'rationale', 'references', 'limitations'];

    protected function casts(): array
    {
        return ['within_assessment_scope' => 'boolean', 'references' => 'array', 'limitations' => 'array'];
    }

    /** @return BelongsTo<AnalysisRun, $this> */
    public function run(): BelongsTo
    {
        return $this->belongsTo(AnalysisRun::class, 'analysis_run_id');
    }
}
