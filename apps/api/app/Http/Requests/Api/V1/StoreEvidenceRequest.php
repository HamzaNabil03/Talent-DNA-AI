<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StoreEvidenceRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'project_id' => ['nullable', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['file', 'link'])],
            'description' => ['nullable', 'string', 'max:3000'],
            'context' => ['nullable', 'string', 'max:3000'],
            'link_url' => ['nullable', 'required_if:type,link', 'url:http,https', 'max:2048'],
            'file' => [
                'nullable',
                'required_if:type,file',
                'mimetypes:'.implode(',', config('evidence.allowed_mime_types')),
                File::types(config('evidence.allowed_extensions'))->max(config('evidence.max_file_size_kb')),
            ],
        ];
    }
}
