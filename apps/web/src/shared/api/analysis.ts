import { apiRequest } from "./auth";

export type EvidenceReference = {
  evidence_id: number;
  kind: string;
  start: number;
  end: number;
  quote: string | null;
  observation: string | null;
};
export type SkillSuggestion = {
  id: number;
  skill_key: string | null;
  skill_name: string;
  within_assessment_scope: boolean;
  rationale: string;
  references: EvidenceReference[];
  limitations: string[];
};
export type AnalysisRun = {
  id: number;
  status: string;
  progress: number;
  is_partial: boolean;
  failure_code: string | null;
  failure_message: string | null;
  suggestions: SkillSuggestion[];
  inputs: Array<{
    evidence_id: number;
    title: string;
    filename: string | null;
    status: string;
    error_message: string | null;
    is_partial: boolean;
  }>;
};
export type DnaSkill = SkillSuggestion & { assessment_status: "not_assessed" };
export type DnaSnapshot = {
  id: number;
  version: number;
  confirmed_at: string;
  skills: DnaSkill[];
};

export const analysisApi = {
  start: () =>
    apiRequest<{ data: AnalysisRun }>("/analysis", { method: "POST" }),
  current: () => apiRequest<{ data: AnalysisRun | null }>("/analysis/current"),
  confirm: (id: number, suggestionIds: number[], idempotencyKey: string) =>
    apiRequest<{ data: DnaSnapshot }>(`/analysis/${id}/confirm`, {
      method: "POST",
      body: JSON.stringify({
        suggestion_ids: suggestionIds,
        idempotency_key: idempotencyKey,
      }),
    }),
  dna: () => apiRequest<{ data: DnaSnapshot | null }>("/dna"),
  skill: (id: number) => apiRequest<{ data: DnaSkill }>(`/dna/skills/${id}`),
};
