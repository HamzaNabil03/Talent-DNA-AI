<?php

return [
    'provider' => env('AI_PROVIDER', 'gemini'),
    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-3.8-flash'),
        'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
        'timeout_seconds' => (int) env('GEMINI_TIMEOUT_SECONDS', 90),
    ],
];
