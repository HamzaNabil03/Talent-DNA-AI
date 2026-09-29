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
import {
  AnalysisPage,
  AssessmentPage,
  BuilderPage,
  CardBuilderPage,
  DnaPage,
  OpportunitiesPage,
  PrivacyPage,
  PublicCardPage,
  ReadinessPage,
  ResultPage,
  ReviewPage,
  SkillDetailPage,
} from "../features/experience/ProductExperience";
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

const profileRoutes = [
  { path: "/builder/direction", render: () => <BuilderPage step={1} /> },
  { path: "/builder/projects", render: () => <BuilderPage step={2} /> },
  { path: "/builder/evidence", render: () => <BuilderPage step={3} /> },
  { path: "/builder/vision", render: () => <BuilderPage step={4} /> },
  { path: "/review", render: () => <ReviewPage /> },
  { path: "/analysis/queued", render: () => <AnalysisPage state="queued" /> },
  { path: "/analysis/failure", render: () => <AnalysisPage state="failure" /> },
  { path: "/analysis/empty", render: () => <AnalysisPage state="empty" /> },
  {
    path: "/analysis/confirmation",
    render: () => <AnalysisPage state="confirmation" />,
  },
  { path: "/dna", render: () => <DnaPage /> },
  { path: "/dna/skills/:skillId", render: () => <SkillDetailPage /> },
  { path: "/readiness", render: () => <ReadinessPage /> },
  { path: "/readiness/resume", render: () => <ReadinessPage resume /> },
  { path: "/assessment", render: () => <AssessmentPage /> },
  {
    path: "/assessment/resume",
    render: () => <AssessmentPage mode="resume" />,
  },
  {
    path: "/assessment/fail",
    render: () => <AssessmentPage mode="fail" />,
  },
  { path: "/results", render: () => <ResultPage /> },
  { path: "/opportunities", render: () => <OpportunitiesPage /> },
  {
    path: "/card-builder/private",
    render: () => <CardBuilderPage status="private" />,
  },
  {
    path: "/card-builder/live",
    render: () => <CardBuilderPage status="live" />,
  },
  {
    path: "/card-builder/revoked",
    render: () => <CardBuilderPage status="revoked" />,
  },
  {
    path: "/privacy/private",
    render: () => <PrivacyPage status="private" />,
  },
  { path: "/privacy/live", render: () => <PrivacyPage status="live" /> },
  {
    path: "/privacy/revoked",
    render: () => <PrivacyPage status="revoked" />,
  },
];

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
                  <Navigate replace to="/builder/direction" />
                </StepGuard>
              }
            />
            <Route
              path="/public-card/private"
              element={<PublicCardPage status="private" />}
            />
            <Route
              path="/public-card/live"
              element={<PublicCardPage status="live" />}
            />
            {profileRoutes.map(({ path, render }) => (
              <Route
                key={path}
                path={path}
                element={<StepGuard step="profile">{render()}</StepGuard>}
              />
            ))}
            <Route path="*" element={<Navigate replace to="/auth/sign-in" />} />
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
