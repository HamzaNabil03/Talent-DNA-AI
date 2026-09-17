import {
  BrainCircuit,
  Cpu,
  Dna,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import consentBackground from "../../assets/consent-background.svg";
import logo from "../../assets/talent-dna-logo.png";
import { ApiError, authApi } from "../../shared/api/auth";
import { useSession } from "../../shared/auth/SessionContext";
import {
  FormAlert,
  LanguageToggle,
  SubmitButton,
} from "../auth/AuthComponents";

export function ConsentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSession } = useSession();
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!accepted || busy) return;
    setBusy(true);
    setError("");
    try {
      const state = await authApi.acceptAiConsent();
      setSession(state);
      navigate("/profile/setup", { replace: true });
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : t("errors.network"),
      );
    } finally {
      setBusy(false);
    }
  };
  const items = [
    "profile",
    "projects",
    "links",
    "evidence",
    "assessments",
  ] as const;
  return (
    <main
      className="consent-page"
      style={{ backgroundImage: `url(${consentBackground})` }}
    >
      <header className="consent-header">
        <LanguageToggle />
        <img src={logo} width="150" height="50" alt="Talent DNA AI" />
      </header>
      <section className="consent-card" aria-labelledby="consent-title">
        <span className="consent-badge">{t("consent.badge")}</span>
        <h1 id="consent-title">{t("consent.title")}</h1>
        <p className="consent-lead">{t("consent.lead")}</p>
        <div className="principle-grid">
          <article>
            <span className="icon-box">
              <LockKeyhole aria-hidden="true" />
            </span>
            <h2>{t("consent.privateTitle")}</h2>
            <p>{t("consent.privateBody")}</p>
          </article>
          <article>
            <span className="icon-box icon-box--purple">
              <BrainCircuit aria-hidden="true" />
            </span>
            <h2>{t("consent.reviewTitle")}</h2>
            <p>{t("consent.reviewBody")}</p>
          </article>
        </div>
        <div className="trust-flow" aria-label={t("consent.flowLabel")}>
          <span>
            <Cpu aria-hidden="true" />
            {t("consent.flowAnalysis")}
          </span>
          <i />
          <span>
            <UserCheck aria-hidden="true" />
            {t("consent.flowReview")}
          </span>
          <i />
          <span>
            <Dna aria-hidden="true" />
            Talent DNA
          </span>
        </div>
        <div className="privacy-callout">
          <ShieldCheck aria-hidden="true" />
          <div>
            <strong>{t("consent.notPublishedTitle")}</strong>
            <p>{t("consent.notPublishedBody")}</p>
          </div>
        </div>
        <section className="data-list">
          <h2>{t("consent.dataTitle")}</h2>
          <ul>
            {items.map((item) => (
              <li key={item}>{t(`consent.data.${item}`)}</li>
            ))}
          </ul>
        </section>
        <section className="deterministic-note">
          <h2>{t("consent.deterministicTitle")}</h2>
          <p>{t("consent.deterministicBody")}</p>
        </section>
        <FormAlert message={error} />
        <form className="consent-form" onSubmit={(event) => void submit(event)}>
          <label className="check-row">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
            />
            <span>{t("consent.accept")}</span>
          </label>
          <SubmitButton busy={busy} disabled={!accepted}>
            {t("consent.submit")}
          </SubmitButton>
        </form>
      </section>
    </main>
  );
}
