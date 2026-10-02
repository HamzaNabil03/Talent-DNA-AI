<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'contribution',
        'role',
        'tools',
        'outcome',
        'project_date',
        'is_team',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<Evidence, $this> */
    public function evidence(): HasMany
    {
        return $this->hasMany(Evidence::class);
    }

    protected function casts(): array
    {
        return [
            'tools' => 'array',
            'project_date' => 'date:Y-m-d',
            'is_team' => 'boolean',
        ];
    }
}
