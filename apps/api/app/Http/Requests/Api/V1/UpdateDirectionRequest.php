<?php

namespace App\Http\Requests\Api\V1;

use App\Domain\Profiles\ProfileField;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDirectionRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'field' => ['nullable', Rule::enum(ProfileField::class)],
            'current_stage' => ['nullable', 'string', 'max:255'],
            'career_direction' => ['nullable', 'string', 'max:255'],
            'professional_interest' => ['nullable', 'string', 'max:255'],
        ];
    }
}
