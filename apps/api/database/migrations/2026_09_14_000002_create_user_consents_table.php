<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_consents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->enum('type', ['terms', 'privacy', 'ai_processing']);
            $table->string('version');
            $table->timestamp('accepted_at');
            $table->timestamps();
            $table->unique(['user_id', 'type', 'version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_consents');
    }
};
