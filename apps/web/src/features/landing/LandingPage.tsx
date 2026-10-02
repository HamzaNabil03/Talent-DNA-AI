import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Code2,
  FileCheck2,
  Globe,
  Menu,
  MessageCircle,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import landingAccentLines from "../../assets/landing-accent-lines.svg";
import landingDna from "../../assets/landing-dna.svg";
import landingParticles from "../../assets/landing-particles.svg";
import logo from "../../assets/talent-dna-logo.png";

type IconItem = { key: string; icon: LucideIcon };

const capabilityTypes: IconItem[] = [
  { key: "self", icon: UserRound },
  { key: "ai", icon: BrainCircuit },
  { key: "evidence", icon: FileCheck2 },
  { key: "assessment", icon: ClipboardCheck },
];

const journeySteps: IconItem[] = [
  { key: "discover", icon: Compass },
  { key: "prove", icon: ShieldCheck },
  { key: "match", icon: Target },
  { key: "grow", icon: TrendingUp },
];

const trustTypes: IconItem[] = [
  { key: "self", icon: UserRound },
  { key: "ai", icon: BrainCircuit },
  { key: "evidence", icon: FileCheck2 },
  { key: "assessment", icon: ClipboardCheck },
];

const metrics: IconItem[] = [
  { key: "privacy", icon: ShieldCheck },
  { key: "opportunities", icon: Rocket },
  { key: "analysis", icon: BrainCircuit },
  { key: "users", icon: UsersRound },
];

const skills = [
  ["creative", 92],
  ["problem", 89],
  ["communication", 84],
  ["adaptability", 91],
  ["technical", 87],
] as const;

function LandingLanguageButton({ closeMenu }: { closeMenu?: () => void }) {
  const { i18n } = useTranslation();
  const next = i18n.language === "en" ? "ar" : "en";
  const change = async () => {
    await i18n.changeLanguage(next);
    localStorage.setItem("talent-dna-language", next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    closeMenu?.();
  };

  return (
    <button
      className="landing-language"
      type="button"
      onClick={() => void change()}
    >
      {i18n.language === "en" ? "العربية" : "English"}
    </button>
  );
}

function DirectionalArrow() {
  const { i18n } = useTranslation();
  const Icon = i18n.dir() === "rtl" ? ArrowLeft : ArrowRight;
  return <Icon aria-hidden="true" size={16} />;
}

function LandingHeader() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="landing-header" id="top">
      <Link className="landing-logo" to="/" aria-label="Talent DNA AI">
        <img src={logo} width="126" height="38" alt="Talent DNA AI" />
      </Link>
      <button
        className="landing-menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="landing-navigation"
        aria-label={open ? t("landing.nav.close") : t("landing.nav.open")}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav
        id="landing-navigation"
        className={`landing-nav${open ? " landing-nav--open" : ""}`}
        aria-label={t("landing.nav.label")}
      >
        <a href="#how" onClick={close}>
          {t("landing.nav.how")}
        </a>
        <a href="#methodology" onClick={close}>
          {t("landing.nav.methodology")}
        </a>
        <a href="#trust" onClick={close}>
          {t("landing.nav.trust")}
        </a>
        <a href="#organizations" onClick={close}>
          {t("landing.nav.organizations")}
        </a>
      </nav>
      <div
        className={`landing-header-actions${open ? " landing-header-actions--open" : ""}`}
      >
        <LandingLanguageButton closeMenu={close} />
        <Link className="landing-sign-in" to="/auth/sign-in" onClick={close}>
          {t("landing.nav.signIn")}
        </Link>
        <Link
          className="landing-button landing-button--small"
          to="/auth/sign-up"
          onClick={close}
        >
          {t("landing.nav.discover")}
        </Link>
      </div>
    </header>
  );
}

function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <img
        className="landing-hero__particles landing-hero__particles--one"
        src={landingParticles}
        alt=""
        aria-hidden="true"
      />
      <img
        className="landing-hero__particles landing-hero__particles--two"
        src={landingParticles}
        alt=""
        aria-hidden="true"
      />
      <img
        className="landing-hero__lines"
        src={landingAccentLines}
        alt=""
        aria-hidden="true"
      />
      <div className="landing-hero__visual" aria-hidden="true">
        <span className="landing-hero__ring landing-hero__ring--outer" />
        <span className="landing-hero__ring landing-hero__ring--inner" />
        <span className="landing-orb landing-orb--cyan" />
        <span className="landing-orb landing-orb--violet" />
        <img src={landingDna} alt="" />
      </div>
      <div className="landing-hero__copy">
        <span className="landing-pill">
          <Sparkles aria-hidden="true" size={14} />
          {t("landing.hero.badge")}
        </span>
        <h1 id="landing-title">
          {t("landing.hero.titleStart")}{" "}
          <span>{t("landing.hero.titleAccent")}</span>
        </h1>
        <h2>
          {t("landing.hero.subtitleStart")}{" "}
          <span>{t("landing.hero.subtitleAccent")}</span>
        </h2>
        <p>{t("landing.hero.body")}</p>
        <div className="landing-hero__actions">
          <Link className="landing-button" to="/auth/sign-up">
            {t("landing.hero.primary")} <DirectionalArrow />
          </Link>
          <a className="landing-button landing-button--ghost" href="#how">
            <Play aria-hidden="true" size={15} /> {t("landing.hero.secondary")}
          </a>
        </div>
      </div>
    </section>
  );
}

function MetricsStrip() {
  const { t } = useTranslation();
  return (
    <div className="landing-metrics" aria-label={t("landing.metrics.label")}>
      {metrics.map(({ key, icon: Icon }) => (
        <div key={key}>
          <span>
            <Icon aria-hidden="true" size={20} />
          </span>
          <strong>{t(`landing.metrics.${key}.value`)}</strong>
          <small>{t(`landing.metrics.${key}.label`)}</small>
        </div>
      ))}
    </div>
  );
}

function TalentCard() {
  const { t } = useTranslation();
  return (
    <article className="talent-card" aria-label={t("landing.profile.label")}>
      <header>
        <div className="talent-card__identity">
          <span>LK</span>
          <div>
            <strong>LAYAN KHALIL</strong>
            <small>TALENT DNA</small>
          </div>
        </div>
        <div className="talent-card__score">
          <small>{t("landing.profile.score")}</small>
          <strong>88%</strong>
        </div>
      </header>
      <div className="talent-card__fingerprint">
        <span aria-hidden="true" />
        <p>{t("landing.profile.description")}</p>
      </div>
      <div className="talent-card__skills">
        {skills.map(([key, value]) => (
          <div key={key}>
            <span>
              <b>{t(`landing.profile.skills.${key}`)}</b>
              <em>{value}%</em>
            </span>
            <i>
              <span style={{ inlineSize: `${value}%` }} />
            </i>
          </div>
        ))}
      </div>
      <footer>
        {["projects", "experience", "portfolio", "validated"].map((key) => (
          <span key={key}>
            <CheckCircle2 aria-hidden="true" size={13} />
            {t(`landing.profile.proof.${key}`)}
          </span>
        ))}
      </footer>
    </article>
  );
}

function CapabilitySection() {
  const { t } = useTranslation();
  return (
    <section
      className="landing-section capability-section"
      id="methodology"
      aria-labelledby="capability-title"
    >
      <div className="capability-copy">
        <div className="landing-section-heading">
          <h2 id="capability-title">
            {t("landing.capability.titleStart")}{" "}
            <span>{t("landing.capability.titleAccent")}</span>
          </h2>
          <p>{t("landing.capability.body")}</p>
        </div>
        <div className="capability-grid">
          {capabilityTypes.map(({ key, icon: Icon }) => (
            <article key={key}>
              <span>
                <Icon aria-hidden="true" size={17} />
              </span>
              <div>
                <h3>{t(`landing.capability.cards.${key}.title`)}</h3>
                <p>{t(`landing.capability.cards.${key}.body`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <TalentCard />
    </section>
  );
}

function JourneySection() {
  const { t } = useTranslation();
  return (
    <section
      className="landing-section journey-section"
      id="how"
      aria-labelledby="journey-title"
    >
      <div className="landing-section-heading">
        <h2 id="journey-title">
          {t("landing.journey.titleStart")}{" "}
          <span>{t("landing.journey.titleAccent")}</span>{" "}
          {t("landing.journey.titleEnd")}
        </h2>
        <p>{t("landing.journey.body")}</p>
      </div>
      <ol className="journey-grid">
        {journeySteps.map(({ key, icon: Icon }, index) => (
          <li key={key}>
            <span className="journey-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <article>
              <Icon aria-hidden="true" size={18} />
              <h3>{t(`landing.journey.steps.${key}.title`)}</h3>
              <p>{t(`landing.journey.steps.${key}.body`)}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TrustSection() {
  const { t } = useTranslation();
  return (
    <section
      className="landing-section trust-section"
      id="trust"
      aria-labelledby="trust-title"
    >
      <div className="landing-section-heading">
        <h2 id="trust-title">
          {t("landing.trust.titleStart")}{" "}
          <span>{t("landing.trust.titleAccent")}</span>
        </h2>
        <p>{t("landing.trust.body")}</p>
      </div>
      <div className="trust-grid">
        {trustTypes.map(({ key, icon: Icon }, index) => (
          <article className={`trust-card trust-card--${key}`} key={key}>
            <span className="trust-card__icon">
              <Icon aria-hidden="true" size={20} />
            </span>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <h3>{t(`landing.trust.cards.${key}.title`)}</h3>
            <strong>{t(`landing.trust.cards.${key}.question`)}</strong>
            <p>{t(`landing.trust.cards.${key}.body`)}</p>
            <em>
              <CheckCircle2 aria-hidden="true" size={13} />
              {t(`landing.trust.cards.${key}.tag`)}
            </em>
          </article>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  const { t } = useTranslation();
  return (
    <section
      className="landing-cta"
      id="organizations"
      aria-labelledby="cta-title"
    >
      <img src={landingParticles} alt="" aria-hidden="true" />
      <div>
        <h2 id="cta-title">{t("landing.cta.title")}</h2>
        <p>{t("landing.cta.body")}</p>
        <div>
          <Link
            className="landing-button landing-button--light"
            to="/auth/sign-up"
          >
            {t("landing.cta.primary")} <DirectionalArrow />
          </Link>
          <a className="landing-button landing-button--outline" href="#how">
            <Play aria-hidden="true" size={15} />
            {t("landing.cta.secondary")}
          </a>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  const { t } = useTranslation();
  const columns = ["platform", "resources", "company", "legal"] as const;
  return (
    <footer className="landing-footer">
      <div className="landing-footer__main">
        <div className="landing-footer__brand">
          <img src={logo} width="126" height="38" alt="Talent DNA AI" />
          <p>{t("landing.footer.tagline")}</p>
          <div aria-label={t("landing.footer.social")}>
            <span aria-hidden="true">
              <Globe size={16} />
            </span>
            <span aria-hidden="true">
              <MessageCircle size={16} />
            </span>
            <span aria-hidden="true">
              <Code2 size={16} />
            </span>
          </div>
        </div>
        {columns.map((column) => (
          <div className="landing-footer__column" key={column}>
            <h2>{t(`landing.footer.${column}.title`)}</h2>
            {["one", "two", "three", "four"].map((item) => {
              const label = t(`landing.footer.${column}.${item}`, {
                defaultValue: "",
              });
              return label ? <span key={item}>{label}</span> : null;
            })}
          </div>
        ))}
      </div>
      <p className="landing-footer__copyright">
        © 2026 Talent DNA AI. {t("landing.footer.copyright")}
      </p>
    </footer>
  );
}

export function LandingPage() {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.title = t("landing.meta.title");
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    description?.setAttribute("content", t("landing.meta.description"));
  }, [t, i18n.language]);

  return (
    <div className="landing-page">
      <div className="landing-shell">
        <LandingHeader />
        <main>
          <HeroSection />
          <MetricsStrip />
          <CapabilitySection />
          <JourneySection />
          <TrustSection />
          <CtaSection />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
