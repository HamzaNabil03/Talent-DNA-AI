import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthLayout } from "../features/auth/AuthComponents";
import {
  ForgotPasswordPage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage,
  VerifyEmailPage,
} from "../features/auth/AuthPages";
import { ConsentPage } from "../features/consent/ConsentPage";
import { LandingPage } from "../features/landing/LandingPage";
import { ProfileSetupHandoff } from "../features/profile/ProfileSetupHandoff";
import { authApi } from "../shared/api/auth";
import {
  SessionProvider,
  routeForNextStep,
  useSession,
} from "../shared/auth/SessionContext";

function LoadingState({ children }: { children?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <main className="route-state" role="status" aria-live="polite">
      {children ?? t("common.loading")}
    </main>
  );
}

function GuestOnly({ children }: { children: ReactNode }) {
  const { session, loading, error, refresh, setSession } = useSession();
  const { t } = useTranslation();
  if (loading) return <LoadingState />;
  if (error)
    return (
      <LoadingState>
        <button type="button" onClick={() => void refresh()}>
          {t("common.retry")}
        </button>
      </LoadingState>
    );
  if (session?.authenticated && session.next_step === "admin") {
    const logout = async () => {
      await authApi.logout();
      setSession(null);
    };
    return (
      <AuthLayout>
        <div className="auth-heading">
          <h1>{t("adminBoundary.title")}</h1>
          <p>{t("adminBoundary.body")}</p>
        </div>
        <button
          className="secondary-button full-width"
          type="button"
          onClick={() => void logout()}
        >
          {t("verify.logout")}
        </button>
      </AuthLayout>
    );
  }
  if (session?.authenticated)
    return <Navigate replace to={routeForNextStep(session.next_step)} />;
  return children;
}

function StepGuard({
  step,
  children,
}: {
  step: "verify" | "consent" | "profile";
  children: ReactNode;
}) {
  const { session, loading, error, refresh } = useSession();
  const location = useLocation();
  const { t } = useTranslation();
  if (loading) return <LoadingState />;
  if (error)
    return (
      <LoadingState>
        <button type="button" onClick={() => void refresh()}>
          {t("common.retry")}
        </button>
      </LoadingState>
    );
  const verificationStatus = new URLSearchParams(location.search).get("status");
  const publicVerificationFailure =
    step === "verify" &&
    (verificationStatus === "expired" || verificationStatus === "invalid");
  if (!session?.authenticated && publicVerificationFailure) return children;
  if (!session?.authenticated) return <Navigate replace to="/auth/sign-in" />;
  if (session.next_step === "admin")
    return <Navigate replace to="/auth/sign-in" />;
  const allowed =
    step === "verify"
      ? !session.email_verified
      : step === "consent"
        ? session.email_verified && !session.consents.ai_processing
        : session.email_verified && session.consents.ai_processing;
  return allowed ? (
    children
  ) : (
    <Navigate replace to={routeForNextStep(session.next_step)} />
  );
}

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/auth/sign-up"
              element={
                <GuestOnly>
                  <SignUpPage />
                </GuestOnly>
              }
            />
            <Route
              path="/auth/sign-in"
              element={
                <GuestOnly>
                  <SignInPage />
                </GuestOnly>
              }
            />
            <Route
              path="/auth/forgot-password"
              element={
                <GuestOnly>
                  <ForgotPasswordPage />
                </GuestOnly>
              }
            />
            <Route
              path="/auth/reset-password"
              element={
                <GuestOnly>
                  <ResetPasswordPage />
                </GuestOnly>
              }
            />
            <Route
              path="/auth/verify-email"
              element={
                <StepGuard step="verify">
                  <VerifyEmailPage />
                </StepGuard>
              }
            />
            <Route
              path="/onboarding/consent"
              element={
                <StepGuard step="consent">
                  <ConsentPage />
                </StepGuard>
              }
            />
            <Route
              path="/profile/setup"
              element={
                <StepGuard step="profile">
                  <ProfileSetupHandoff />
                </StepGuard>
              }
            />
            <Route path="*" element={<Navigate replace to="/auth/sign-in" />} />
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
