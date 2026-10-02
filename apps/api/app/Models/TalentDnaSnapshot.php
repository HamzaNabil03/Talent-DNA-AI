<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $analysis_run_id
 * @property int $version
 * @property Carbon $confirmed_at
 * @property-read Collection<int, TalentDnaSnapshotSkill> $skills
 */
class TalentDnaSnapshot extends Model
{
    protected $fillable = ['analysis_run_id', 'version', 'idempotency_key', 'confirmed_at'];

    protected function casts(): array
    {
        return ['version' => 'integer', 'confirmed_at' => 'datetime'];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<AnalysisRun, $this> */
    public function run(): BelongsTo
    {
        return $this->belongsTo(AnalysisRun::class, 'analysis_run_id');
    }

    /** @return HasMany<TalentDnaSnapshotSkill, $this> */
    public function skills(): HasMany
    {
        return $this->hasMany(TalentDnaSnapshotSkill::class);
    }
}
