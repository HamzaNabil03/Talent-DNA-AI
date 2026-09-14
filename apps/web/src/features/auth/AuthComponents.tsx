import {
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import authBackground from "../../assets/auth-background.svg";
import authHero from "../../assets/auth-hero.png";
import logo from "../../assets/talent-dna-logo.png";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const next = i18n.language === "en" ? "ar" : "en";
  const change = async () => {
    await i18n.changeLanguage(next);
    localStorage.setItem("talent-dna-language", next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };
  return (
    <button
      className="language-toggle"
      type="button"
      onClick={() => void change()}
      aria-label={
        i18n.language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
      }
    >
      <Globe2 aria-hidden="true" size={16} />{" "}
      {i18n.language === "en" ? "العربية" : "English"}
    </button>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <main
      className="auth-page"
      style={{ backgroundImage: `url(${authBackground})` }}
    >
      <header className="auth-header">
        <LanguageToggle />
        <img src={logo} width="150" height="50" alt="Talent DNA AI" />
      </header>
      <div className="auth-grid">
        <section className="auth-card">{children}</section>
        <aside className="auth-visual" aria-label={t("auth.visualLabel")}>
          <div className="auth-visual__copy">
            <strong>{t("auth.visualTitle")}</strong>
            <span>{t("auth.visualSubtitle")}</span>
          </div>
          <div className="auth-visual__portrait">
            <span className="auth-orb auth-orb--one" />
            <span className="auth-orb auth-orb--two" />
            <img src={authHero} alt={t("auth.heroAlt")} />
          </div>
        </aside>
      </div>
    </main>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: "user" | "mail" | "lock";
};

export function FormField({
  label,
  error,
  icon = "mail",
  id,
  ...props
}: FieldProps) {
  const Icon =
    icon === "user" ? UserRound : icon === "lock" ? LockKeyhole : Mail;
  return (
    <div className="form-field">
      <label htmlFor={id}>
        <Icon aria-hidden="true" size={16} /> {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error ? (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function PasswordField(props: Omit<FieldProps, "type" | "icon">) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="password-field">
      <FormField {...props} type={visible ? "text" : "password"} icon="lock" />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
      >
        {visible ? (
          <EyeOff aria-hidden="true" size={18} />
        ) : (
          <Eye aria-hidden="true" size={18} />
        )}
      </button>
    </div>
  );
}

export function FormAlert({
  message,
  kind = "error",
}: {
  message?: string;
  kind?: "error" | "success";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (message) ref.current?.focus();
  }, [message]);
  return message ? (
    <div
      ref={ref}
      tabIndex={-1}
      className={`form-alert form-alert--${kind}`}
      role={kind === "error" ? "alert" : "status"}
      aria-live="assertive"
    >
      {message}
    </div>
  ) : null;
}

export function SubmitButton({
  busy,
  children,
  disabled,
}: {
  busy: boolean;
  children: ReactNode;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <button
      className="primary-button"
      type="submit"
      disabled={busy || disabled}
    >
      {busy ? t("common.submitting") : children}
    </button>
  );
}

export function LegalDialog({
  type,
  onClose,
}: {
  type: "terms" | "privacy";
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (dialog.current && !dialog.current.open) {
      if (typeof dialog.current.showModal === "function")
        dialog.current.showModal();
      else dialog.current.setAttribute("open", "");
    }
  }, []);
  return (
    <dialog
      ref={dialog}
      className="legal-dialog"
      aria-modal="true"
      aria-labelledby="legal-title"
      onCancel={onClose}
    >
      <div className="legal-dialog__header">
        <h2 id="legal-title">{t(`legal.${type}.title`)}</h2>
        <button type="button" onClick={onClose} aria-label={t("common.close")}>
          <X aria-hidden="true" />
        </button>
      </div>
      <p>{t(`legal.${type}.body`)}</p>
      <p className="legal-dialog__notice">{t("legal.reviewNotice")}</p>
      <button className="secondary-button" type="button" onClick={onClose}>
        {t("common.close")}
      </button>
    </dialog>
  );
}
