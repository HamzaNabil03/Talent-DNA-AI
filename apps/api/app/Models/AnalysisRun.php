<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $status
 * @property int $progress
 * @property bool $is_partial
 * @property string|null $provider
 * @property string|null $model
 * @property string|null $failure_code
 * @property string|null $failure_message
 * @property Carbon|null $started_at
 * @property Carbon|null $completed_at
 * @property Carbon|null $created_at
 * @property-read User $user
 * @property-read Collection<int, AnalysisInput> $inputs
 * @property-read Collection<int, AnalysisSuggestion> $suggestions
 */
class AnalysisRun extends Model
{
    protected $fillable = ['status', 'progress', 'input_fingerprint', 'is_partial', 'provider', 'model', 'prompt_version', 'schema_version', 'failure_code', 'failure_message', 'usage', 'started_at', 'completed_at'];

    protected function casts(): array
    {
        return ['progress' => 'integer', 'is_partial' => 'boolean', 'usage' => 'array', 'started_at' => 'datetime', 'completed_at' => 'datetime'];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<AnalysisInput, $this> */
    public function inputs(): HasMany
    {
        return $this->hasMany(AnalysisInput::class);
    }

    /** @return HasMany<AnalysisSuggestion, $this> */
    public function suggestions(): HasMany
    {
        return $this->hasMany(AnalysisSuggestion::class);
    }

    /** @return HasOne<TalentDnaSnapshot, $this> */
    public function snapshot(): HasOne
    {
        return $this->hasOne(TalentDnaSnapshot::class);
    }
}
