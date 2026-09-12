<?php

namespace Tests\Unit;

use App\Application\AI\AiProvider;
use App\Infrastructure\AI\FakeAiProvider;
use Tests\TestCase;

final class ModuleBootstrappingTest extends TestCase
{
    public function test_all_domain_module_boundaries_are_loadable(): void
    {
        $modules = [
            'Identity', 'Consent', 'Profiles', 'Evidence', 'SkillTaxonomy',
            'Analysis', 'TalentDNA', 'Assessments', 'Opportunities', 'Matching',
            'PublicCards', 'Privacy', 'Audit',
        ];

        foreach ($modules as $module) {
            $this->assertTrue(class_exists("App\\Domain\\{$module}\\Module"));
        }
    }

    public function test_ai_provider_is_bound_to_the_deterministic_fake(): void
    {
        $provider = $this->app->make(AiProvider::class);

        $this->assertInstanceOf(FakeAiProvider::class, $provider);
        $this->assertSame([], $provider->extract([])['suggestions']);
    }
}
