<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEvidenceRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'project_id' => ['nullable', 'integer'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:3000'],
            'context' => ['nullable', 'string', 'max:3000'],
            'link_url' => ['nullable', 'url:http,https', 'max:2048'],
        ];
    }
}
