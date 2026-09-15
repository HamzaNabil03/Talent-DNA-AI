<?php

namespace App\Models;

use App\Domain\Consent\ConsentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use LogicException;

class UserConsent extends Model
{
    protected $fillable = ['user_id', 'type', 'version', 'accepted_at'];

    protected static function booted(): void
    {
        static::updating(fn () => throw new LogicException('Consent records are append-only.'));
        static::deleting(fn () => throw new LogicException('Consent records are append-only.'));
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'type' => ConsentType::class,
            'accepted_at' => 'immutable_datetime',
        ];
    }
}
