<?php

namespace App\Domain\Identity;

enum UserRole: string
{
    case Student = 'student';
    case Admin = 'admin';
}
