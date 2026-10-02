<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'contribution' => ['nullable', 'string', 'max:5000'],
            'role' => ['nullable', 'required_if:is_team,true', 'string', 'max:255'],
            'tools' => ['nullable', 'array', 'max:30'],
            'tools.*' => ['string', 'distinct', 'max:80'],
            'outcome' => ['nullable', 'string', 'max:3000'],
            'project_date' => ['nullable', 'date_format:Y-m-d', 'before_or_equal:today'],
            'is_team' => ['required', 'boolean'],
        ];
    }
}
