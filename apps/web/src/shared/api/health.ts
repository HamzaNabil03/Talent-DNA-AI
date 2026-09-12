import { useQuery } from "@tanstack/react-query";
import type { components } from "@talent-dna/contracts";

export type HealthResponse = components["schemas"]["HealthResponse"];

async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/v1/health", {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Health endpoint unavailable");
  return response.json() as Promise<HealthResponse>;
}

export function useHealth() {
  return useQuery({ queryKey: ["health"], queryFn: fetchHealth });
}
