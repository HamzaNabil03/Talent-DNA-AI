<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $evidence_id
 * @property int $evidence_version
 * @property string|null $evidence_sha256
 * @property string|null $extracted_text
 * @property string $source_type
 * @property array<string, mixed>|null $reference_map
 * @property string $status
 * @property string|null $error_code
 * @property string|null $error_message
 * @property bool $is_partial
 * @property-read Evidence|null $evidence
 */
class AnalysisInput extends Model
{
    protected $fillable = ['evidence_id', 'evidence_version', 'evidence_sha256', 'source_type', 'extracted_text', 'reference_map', 'status', 'error_code', 'error_message', 'is_partial'];

    protected $hidden = ['extracted_text'];

    protected function casts(): array
    {
        return ['reference_map' => 'array', 'is_partial' => 'boolean'];
    }

    /** @return BelongsTo<AnalysisRun, $this> */
    public function run(): BelongsTo
    {
        return $this->belongsTo(AnalysisRun::class, 'analysis_run_id');
    }

    /** @return BelongsTo<Evidence, $this> */
    public function evidence(): BelongsTo
    {
        return $this->belongsTo(Evidence::class);
    }
}
