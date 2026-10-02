<?php

namespace App\Models;

use App\Domain\Profiles\ProfileField;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    protected $fillable = [
        'field',
        'current_stage',
        'career_direction',
        'professional_interest',
        'vision',
        'strengths',
        'current_step',
        'input_completed_at',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'field' => ProfileField::class,
            'strengths' => 'array',
            'current_step' => 'integer',
            'input_completed_at' => 'datetime',
        ];
    }
}
