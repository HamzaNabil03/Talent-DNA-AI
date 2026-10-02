<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evidence extends Model
{
    protected $table = 'evidence';

    protected $fillable = [
        'project_id',
        'title',
        'type',
        'description',
        'context',
        'link_url',
        'original_filename',
        'mime_type',
        'size_bytes',
        'storage_disk',
        'storage_path',
        'upload_status',
        'validation_status',
        'read_status',
        'analysis_status',
        'content_version',
        'content_sha256',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
            'content_version' => 'integer',
        ];
    }
}
