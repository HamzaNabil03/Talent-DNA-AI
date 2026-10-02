<?php

namespace App\Application\AI;

use RuntimeException;

final class AiProviderException extends RuntimeException
{
    public function __construct(string $message, public readonly string $safeCode, public readonly bool $transient = false)
    {
        parent::__construct($message);
    }
}
