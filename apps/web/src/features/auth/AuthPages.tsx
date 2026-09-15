import { useState, type FormEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ApiError, authApi } from "../../shared/api/auth";
import { routeForNextStep, useSession } from "../../shared/auth/SessionContext";
import {
  AuthLayout,
  FormAlert,
  FormField,
  LegalDialog,
  PasswordField,
  SubmitButton,
} from "./AuthComponents";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function SignUpPage() {
  const { t, i18n } = useTranslation();
  const { setSession } = useSession();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [legal, setLegal] = useState<"terms" | "privacy" | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("password_confirmation") ?? "");
    const clientErrors: Record<string, string> = {};
    if (password.length < 10)
      clientErrors.password = t("validation.passwordLength");
    if (password !== confirmation)
      clientErrors.password_confirmation = t("validation.passwordMatch");
    if (!data.get("accept_terms_and_privacy"))
      clientErrors.accept_terms_and_privacy = t("validation.consentRequired");
    setFields(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setBusy(true);
    setError("");
    try {
      const state = await authApi.register({
        name: String(data.get("name")),
        email: String(data.get("email")),
        password,
        password_confirmation: confirmation,
        accept_terms_and_privacy: true,
        locale: i18n.language === "en" ? "en" : "ar",
      });
      setSession(state);
      navigate(routeForNextStep(state.next_step), { replace: true });
    } catch (caught) {
      if (caught instanceof ApiError)
        setFields(
          Object.fromEntries(
            Object.entries(caught.errors).map(([key, value]) => [
              key,
              value[0] ?? "",
            ]),
          ),
        );
      setError(errorMessage(caught, t("errors.network")));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-heading">
        <h1>{t("signup.title")}</h1>
        <p>{t("signup.subtitle")}</p>
      </div>
      <FormAlert message={error} />
      <form onSubmit={(event) => void submit(event)} noValidate>
        <FormField
          id="name"
          name="name"
          label={t("fields.name")}
          placeholder={t("fields.name")}
          autoComplete="name"
          required
          icon="user"
          error={fields.name}
        />
        <FormField
          id="email"
          name="email"
          type="email"
          label={t("fields.email")}
          placeholder={t("fields.email")}
          autoComplete="email"
          required
          error={fields.email}
        />
        <PasswordField
          id="password"
          name="password"
          label={t("fields.password")}
          placeholder={t("fields.password")}
          autoComplete="new-password"
          required
          error={fields.password}
        />
        <PasswordField
          id="password_confirmation"
          name="password_confirmation"
          label={t("fields.passwordConfirmation")}
          placeholder={t("fields.passwordConfirmation")}
          autoComplete="new-password"
          required
          error={fields.password_confirmation}
        />
        <div className="check-row">
          <input
            type="checkbox"
            name="accept_terms_and_privacy"
            aria-label={t("signup.acceptCheckbox")}
            aria-describedby={
              fields.accept_terms_and_privacy ? "legal-error" : undefined
            }
          />
          <span>
            <Trans i18nKey="signup.accept">
              <button
                type="button"
                className="text-button"
                onClick={() => setLegal("terms")}
              />{" "}
              <button
                type="button"
                className="text-button"
                onClick={() => setLegal("privacy")}
              />
            </Trans>
          </span>
        </div>
        {fields.accept_terms_and_privacy ? (
          <span id="legal-error" className="field-error">
            {fields.accept_terms_and_privacy}
          </span>
        ) : null}
        <SubmitButton busy={busy}>{t("signup.submit")}</SubmitButton>
      </form>
      <p className="auth-switch">
        {t("signup.haveAccount")}{" "}
        <Link to="/auth/sign-in">{t("signup.signIn")}</Link>
      </p>
      {legal ? (
        <LegalDialog type={legal} onClose={() => setLegal(null)} />
      ) : null}
    </AuthLayout>
  );
}

export function SignInPage() {
  const { t } = useTranslation();
  const { setSession } = useSession();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const state = await authApi.login({
        email: String(data.get("email")),
        password: String(data.get("password")),
      });
      setSession(state);
      navigate(routeForNextStep(state.next_step), { replace: true });
    } catch (caught) {
      setError(errorMessage(caught, t("errors.network")));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout>
      <div className="auth-heading">
        <h1>{t("signin.title")}</h1>
        <p>{t("signin.subtitle")}</p>
      </div>
      <FormAlert
        message={params.get("verified") === "1" ? t("signin.verified") : ""}
        kind="success"
      />
      <FormAlert message={error} />
      <form onSubmit={(event) => void submit(event)}>
        <FormField
          id="email"
          name="email"
          type="email"
          label={t("fields.email")}
          autoComplete="email"
          required
        />
        <PasswordField
          id="password"
          name="password"
          label={t("fields.password")}
          autoComplete="current-password"
          required
        />
        <Link className="forgot-link" to="/auth/forgot-password">
          {t("signin.forgot")}
        </Link>
        <SubmitButton busy={busy}>{t("signin.submit")}</SubmitButton>
      </form>
      <p className="auth-switch">
        {t("signin.noAccount")}{" "}
        <Link to="/auth/sign-up">{t("signin.signUp")}</Link>
      </p>
    </AuthLayout>
  );
}

export function VerifyEmailPage() {
  const { t } = useTranslation();
  const { session, setSession } = useSession();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const linkStatus = params.get("status");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    linkStatus ? t(`verify.${linkStatus}`) : "",
  );
  const resend = async () => {
    setBusy(true);
    try {
      const result = await authApi.resendVerification();
      setMessage(t(`verify.${result.status}`));
    } catch (caught) {
      setMessage(errorMessage(caught, t("errors.network")));
    } finally {
      setBusy(false);
    }
  };
  const logout = async () => {
    await authApi.logout();
    setSession(null);
    navigate("/auth/sign-in", { replace: true });
  };
  return (
    <AuthLayout>
      <div className="auth-heading">
        <h1>{t("verify.title")}</h1>
        <p>{t("verify.subtitle")}</p>
      </div>
      <FormAlert
        message={message}
        kind={
          linkStatus === "invalid" || linkStatus === "expired"
            ? "error"
            : "success"
        }
      />
      {session?.authenticated ? (
        <>
          <button
            className="primary-button"
            type="button"
            onClick={() => void resend()}
            disabled={busy}
          >
            {busy ? t("common.submitting") : t("verify.resend")}
          </button>
          <button
            className="secondary-button full-width"
            type="button"
            onClick={() => void logout()}
          >
            {t("verify.logout")}
          </button>
        </>
      ) : (
        <Link className="primary-button" to="/auth/sign-in">
          {t("verify.signIn")}
        </Link>
      )}
    </AuthLayout>
  );
}

export function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await authApi.forgotPassword({
        email: String(data.get("email")),
        locale: i18n.language === "en" ? "en" : "ar",
      });
      setMessage(t("forgot.success"));
    } catch (caught) {
      setError(errorMessage(caught, t("errors.network")));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout>
      <div className="auth-heading">
        <h1>{t("forgot.title")}</h1>
        <p>{t("forgot.subtitle")}</p>
      </div>
      <FormAlert message={error} />
      <FormAlert message={message} kind="success" />
      <form onSubmit={(event) => void submit(event)}>
        <FormField
          id="email"
          name="email"
          type="email"
          label={t("fields.email")}
          required
        />
        <SubmitButton busy={busy}>{t("forgot.submit")}</SubmitButton>
      </form>
      <p className="auth-switch">
        <Link to="/auth/sign-in">{t("forgot.back")}</Link>
      </p>
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password"));
    const confirmation = String(data.get("password_confirmation"));
    if (password.length < 10 || password !== confirmation) {
      setError(
        t(
          password.length < 10
            ? "validation.passwordLength"
            : "validation.passwordMatch",
        ),
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      await authApi.resetPassword({
        token: params.get("token") ?? "",
        email: params.get("email") ?? "",
        password,
        password_confirmation: confirmation,
        locale: i18n.language === "en" ? "en" : "ar",
      });
      setSuccess(t("reset.success"));
      setTimeout(() => navigate("/auth/sign-in", { replace: true }), 500);
    } catch (caught) {
      setError(errorMessage(caught, t("reset.invalid")));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout>
      <div className="auth-heading">
        <h1>{t("reset.title")}</h1>
        <p>{t("reset.subtitle")}</p>
      </div>
      <FormAlert message={error} />
      <FormAlert message={success} kind="success" />
      <form onSubmit={(event) => void submit(event)}>
        <PasswordField
          id="password"
          name="password"
          label={t("fields.password")}
          required
        />
        <PasswordField
          id="password_confirmation"
          name="password_confirmation"
          label={t("fields.passwordConfirmation")}
          required
        />
        <SubmitButton busy={busy}>{t("reset.submit")}</SubmitButton>
      </form>
    </AuthLayout>
  );
}
