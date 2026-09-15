/* oxlint-disable react/only-export-components, react/set-state-in-effect */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, type AuthState } from "../api/auth";

type SessionContextValue = {
  session: AuthState | null;
  loading: boolean;
  error: boolean;
  setSession: (state: AuthState | null) => void;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refresh = async () => {
    setError(false);
    try {
      setSession(await authApi.session());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const value = useMemo(
    () => ({ session, loading, error, setSession, refresh }),
    [session, loading, error],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within SessionProvider");
  return context;
}

export function routeForNextStep(nextStep: AuthState["next_step"]): string {
  if (nextStep === "verify_email") return "/auth/verify-email";
  if (nextStep === "consent") return "/onboarding/consent";
  if (nextStep === "profile_setup") return "/profile/setup";
  return "/auth/sign-in";
}
