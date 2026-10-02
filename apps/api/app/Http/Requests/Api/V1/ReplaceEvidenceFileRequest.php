<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class ReplaceEvidenceFileRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'mimetypes:'.implode(',', config('evidence.allowed_mime_types')),
                File::types(config('evidence.allowed_extensions'))->max(config('evidence.max_file_size_kb')),
            ],
        ];
    }
}
