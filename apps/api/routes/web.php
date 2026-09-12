<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/{path?}', function () {
    $spa = public_path('app/index.html');

    abort_unless(File::exists($spa), 503, 'Frontend build is not installed.');

    return response(File::get($spa), 200, [
        'Content-Type' => 'text/html; charset=UTF-8',
    ]);
})->where('path', '^(?!api(?:/|$)).*');
