<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVisionRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'vision' => ['nullable', 'string', 'max:3000'],
            'strengths' => ['nullable', 'array', 'max:10'],
            'strengths.*' => ['string', 'distinct', 'max:80'],
        ];
    }
}
