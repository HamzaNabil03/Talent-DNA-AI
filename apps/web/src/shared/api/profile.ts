import type { components } from "@talent-dna/contracts";
import { apiRequest } from "./auth";

export type Profile = components["schemas"]["Profile"];
export type DirectionInput = components["schemas"]["DirectionInput"];
export type VisionInput = components["schemas"]["VisionInput"];
export type Project = components["schemas"]["Project"];
export type ProjectInput = components["schemas"]["ProjectInput"];
export type Evidence = components["schemas"]["Evidence"];
export type EvidenceLimits = components["schemas"]["EvidenceLimits"];

type DataResponse<T> = { data: T };
type EvidenceResponse = DataResponse<Evidence> & { limits?: EvidenceLimits };

export const profileApi = {
  getProfile: () => apiRequest<DataResponse<Profile>>("/profile"),
  saveDirection: (body: DirectionInput) =>
    apiRequest<DataResponse<Profile>>("/profile/direction", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  saveVision: (body: VisionInput) =>
    apiRequest<DataResponse<Profile>>("/profile/vision", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  complete: () =>
    apiRequest<DataResponse<Profile>>("/profile/complete", { method: "POST" }),
  projects: () => apiRequest<DataResponse<Project[]>>("/projects"),
  createProject: (body: ProjectInput) =>
    apiRequest<DataResponse<Project>>("/projects", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateProject: (id: number, body: ProjectInput) =>
    apiRequest<DataResponse<Project>>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteProject: (id: number) =>
    apiRequest<void>(`/projects/${id}`, { method: "DELETE" }),
  evidence: () =>
    apiRequest<{ data: Evidence[]; limits: EvidenceLimits }>("/evidence"),
  createEvidence: (body: FormData) =>
    apiRequest<EvidenceResponse>("/evidence", { method: "POST", body }),
  updateEvidence: (
    id: number,
    body: components["schemas"]["EvidenceMetadataInput"],
  ) =>
    apiRequest<EvidenceResponse>(`/evidence/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  replaceEvidenceFile: (id: number, file: File) => {
    const body = new FormData();
    body.set("file", file);
    return apiRequest<EvidenceResponse>(`/evidence/${id}/file`, {
      method: "POST",
      body,
    });
  },
  deleteEvidence: (id: number) =>
    apiRequest<void>(`/evidence/${id}`, { method: "DELETE" }),
};
