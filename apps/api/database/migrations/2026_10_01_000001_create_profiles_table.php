<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('field', 40)->nullable();
            $table->string('current_stage')->nullable();
            $table->string('career_direction')->nullable();
            $table->string('professional_interest')->nullable();
            $table->text('vision')->nullable();
            $table->json('strengths')->nullable();
            $table->unsignedTinyInteger('current_step')->default(1);
            $table->timestamp('input_completed_at')->nullable();
            $table->timestamps();
        });

        $now = now();
        DB::table('users')->orderBy('id')->chunkById(100, function ($users) use ($now): void {
            DB::table('profiles')->insertOrIgnore(
                $users->map(fn ($user): array => [
                    'user_id' => $user->id,
                    'current_step' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])->all(),
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
