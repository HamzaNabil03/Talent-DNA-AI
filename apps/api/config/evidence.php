<?php

return [
    // Temporary conservative development limits; product approval is required before launch.
    'disk' => env('EVIDENCE_DISK', 'evidence'),
    'max_items_per_user' => (int) env('EVIDENCE_MAX_ITEMS_PER_USER', 20),
    'max_file_size_kb' => (int) env('EVIDENCE_MAX_FILE_SIZE_KB', 10240),
    'allowed_mime_types' => [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/javascript',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    'allowed_extensions' => ['pdf', 'jpg', 'jpeg', 'png', 'txt', 'docx', 'html', 'htm', 'css', 'js'],
    'analysis' => [
        // Conservative temporary limits; exceeding one produces an explicit partial result.
        'max_files' => (int) env('EVIDENCE_ANALYSIS_MAX_FILES', 5),
        'max_text_characters_per_file' => (int) env('EVIDENCE_ANALYSIS_MAX_TEXT_CHARACTERS', 100000),
        'max_pdf_pages' => (int) env('EVIDENCE_ANALYSIS_MAX_PDF_PAGES', 30),
    ],
];
