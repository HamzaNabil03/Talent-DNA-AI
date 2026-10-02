<?php

namespace App\Policies;

use App\Models\Evidence;
use App\Models\User;

class EvidencePolicy
{
    public function view(User $user, Evidence $evidence): bool
    {
        return $evidence->user_id === $user->id;
    }

    public function update(User $user, Evidence $evidence): bool
    {
        return $evidence->user_id === $user->id;
    }

    public function delete(User $user, Evidence $evidence): bool
    {
        return $evidence->user_id === $user->id;
    }
}
