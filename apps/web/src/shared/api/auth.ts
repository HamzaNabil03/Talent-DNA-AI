import type { components } from "@talent-dna/contracts";

export type AuthState = components["schemas"]["AuthState"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];
export type LoginRequest = components["schemas"]["LoginRequest"];
export type ResetPasswordRequest =
  components["schemas"]["ResetPasswordRequest"];

export class ApiError extends Error {
  readonly errors: Record<string, string[]>;
  readonly status: number;

  constructor(
    message: string,
    errors: Record<string, string[]> = {},
    status = 0,
  ) {
    super(message);
    this.errors = errors;
    this.status = status;
  }
}

function cookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}

async function csrf(): Promise<void> {
  const response = await fetch("/sanctum/csrf-cookie", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok)
    throw new ApiError(
      "Unable to initialize a secure session.",
      {},
      response.status,
    );
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") await csrf();

  const xsrf = cookie("XSRF-TOKEN");
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(xsrf ? { "X-XSRF-TOKEN": decodeURIComponent(xsrf) } : {}),
      ...init.headers,
    },
  });

  if (response.status === 204) return undefined as T;
  const body = (await response.json().catch(() => ({}))) as {
    detail?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };
  if (!response.ok) {
    throw new ApiError(
      body.detail ?? body.message ?? "Request failed.",
      body.errors,
      response.status,
    );
  }
  return body as T;
}

export const authApi = {
  session: () => request<AuthState>("/auth/session"),
  register: (body: RegisterRequest) =>
    request<AuthState>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: LoginRequest) =>
    request<AuthState>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  resendVerification: () =>
    request<{ status: "verification_link_sent" | "already_verified" }>(
      "/auth/email/verification-notification",
      { method: "POST" },
    ),
  forgotPassword: (body: components["schemas"]["ForgotPasswordRequest"]) =>
    request<{ status: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  resetPassword: (body: ResetPasswordRequest) =>
    request<{ status: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  acceptAiConsent: () =>
    request<AuthState>("/consents/ai-processing", {
      method: "POST",
      body: JSON.stringify({ accept_ai_processing: true }),
    }),
};
