<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('evidence', function (Blueprint $table): void {
            $table->unsignedInteger('content_version')->default(1);
            $table->string('content_sha256', 64)->nullable();
        });

        Schema::create('analysis_runs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status', 30)->default('queued');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->string('input_fingerprint', 64);
            $table->boolean('is_partial')->default(false);
            $table->string('provider', 30)->nullable();
            $table->string('model')->nullable();
            $table->string('prompt_version', 30)->default('evidence-v1');
            $table->string('schema_version', 30)->default('skills-v1');
            $table->string('failure_code', 80)->nullable();
            $table->text('failure_message')->nullable();
            $table->json('usage')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
            $table->index(['user_id', 'input_fingerprint', 'status']);
        });

        Schema::create('analysis_inputs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('analysis_run_id')->constrained()->cascadeOnDelete();
            $table->foreignId('evidence_id')->nullable()->constrained('evidence')->nullOnDelete();
            $table->unsignedInteger('evidence_version');
            $table->string('evidence_sha256', 64)->nullable();
            $table->string('source_type', 30);
            $table->longText('extracted_text')->nullable();
            $table->json('reference_map')->nullable();
            $table->string('status', 30)->default('pending');
            $table->string('error_code', 80)->nullable();
            $table->text('error_message')->nullable();
            $table->boolean('is_partial')->default(false);
            $table->timestamps();
        });

        Schema::create('analysis_suggestions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('analysis_run_id')->constrained()->cascadeOnDelete();
            $table->string('skill_key')->nullable();
            $table->string('skill_name');
            $table->boolean('within_assessment_scope')->default(false);
            $table->text('rationale');
            $table->json('references');
            $table->json('limitations');
            $table->timestamps();
        });

        Schema::create('talent_dna_snapshots', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('analysis_run_id')->unique()->constrained()->restrictOnDelete();
            $table->unsignedInteger('version');
            $table->string('idempotency_key', 100);
            $table->timestamp('confirmed_at');
            $table->timestamps();
            $table->unique(['user_id', 'version']);
            $table->unique(['user_id', 'idempotency_key']);
        });

        Schema::create('talent_dna_snapshot_skills', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('talent_dna_snapshot_id')->constrained()->cascadeOnDelete();
            $table->foreignId('analysis_suggestion_id')->constrained()->restrictOnDelete();
            $table->string('skill_key')->nullable();
            $table->string('skill_name');
            $table->boolean('within_assessment_scope')->default(false);
            $table->string('assessment_status', 30)->default('not_assessed');
            $table->text('rationale');
            $table->json('references');
            $table->json('limitations');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talent_dna_snapshot_skills');
        Schema::dropIfExists('talent_dna_snapshots');
        Schema::dropIfExists('analysis_suggestions');
        Schema::dropIfExists('analysis_inputs');
        Schema::dropIfExists('analysis_runs');
        Schema::table('evidence', function (Blueprint $table): void {
            $table->dropColumn(['content_version', 'content_sha256']);
        });
    }
};
