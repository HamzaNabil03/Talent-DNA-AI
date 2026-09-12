<?php

namespace App\Application\AI;

interface AiProvider
{
    /**
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    public function extract(array $input): array;
}
