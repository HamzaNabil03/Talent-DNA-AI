/* oxlint-disable react/set-state-in-effect -- API-backed route state */
import {
  AlertTriangle,
  Check,
  Dna,
  FileSearch,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  analysisApi,
  type AnalysisRun,
  type DnaSkill,
  type DnaSnapshot,
} from "../../shared/api/analysis";
import { ApiError } from "../../shared/api/auth";
import { ProductHeader } from "../experience/ProductExperience";

const terminal = new Set([
  "ready",
  "partial",
  "failed",
  "not_configured",
  "stale",
]);

export function AnalysisPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const c = (ar: string, en: string) => (isEnglish ? en : ar);
  const navigate = useNavigate();
  const [run, setRun] = useState<AnalysisRun | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const response = await analysisApi.current();
      setRun(response.data);
    } catch (value) {
      setError(
        value instanceof ApiError
          ? value.message
          : isEnglish
            ? "Could not load analysis."
            : "تعذر تحميل التحليل.",
      );
    }
  }, [isEnglish]);
  useEffect(() => {
    void load();
  }, [load]);
  const runStatus = run?.status;
  useEffect(() => {
    if (!runStatus || terminal.has(runStatus)) return;
    const timer = window.setInterval(() => void load(), 1800);
    return () => window.clearInterval(timer);
  }, [load, runStatus]);
  const start = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await analysisApi.start();
      setRun(response.data);
    } catch (value) {
      setError(
        value instanceof ApiError
          ? value.message
          : c("تعذر بدء التحليل.", "Could not start analysis."),
      );
    } finally {
      setBusy(false);
    }
  };
  const confirm = async () => {
    if (!run || selected.length === 0) return;
    setBusy(true);
    setError("");
    try {
      await analysisApi.confirm(run.id, selected, crypto.randomUUID());
      navigate("/dna");
    } catch (value) {
      setError(
        value instanceof ApiError
          ? value.message
          : c("تعذر تأكيد الاختيارات.", "Could not confirm selections."),
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="product-page">
      <ProductHeader section={c("تحليل الأدلة", "Evidence analysis")} />
      <section className="analysis-shell">
        <header className="analysis-hero">
          <FileSearch />
          <div>
            <span>
              {c("تحليل خاص وبطلبك", "Private, user-triggered analysis")}
            </span>
            <h1>
              {c(
                "حوّل الأدلة إلى مهارات مقترحة.",
                "Turn evidence into suggested skills.",
              )}
            </h1>
            <p>
              {c(
                "لا نمنح درجات أو أحكام جاهزية. أنت تختار ما يدخل إلى Talent DNA.",
                "No scores or readiness verdicts. You choose what enters Talent DNA.",
              )}
            </p>
          </div>
        </header>
        {!run && (
          <section className="analysis-state">
            <ShieldCheck />
            <h2>{c("جاهز للبدء", "Ready to start")}</h2>
            <p>
              {c(
                "لن نقرأ الروابط، ولن يبدأ التحليل إلا بعد ضغط الزر.",
                "Links are never fetched, and analysis starts only when you press the button.",
              )}
            </p>
            <button
              className="primary-button"
              onClick={() => void start()}
              disabled={busy}
            >
              {c("ابدأ التحليل", "Start analysis")}
            </button>
          </section>
        )}
        {run && !terminal.has(run.status) && (
          <section className="analysis-state" role="status">
            <LoaderCircle className="spin" />
            <h2>{c("جارٍ تحليل أدلتك…", "Analyzing your evidence…")}</h2>
            <progress value={run.progress} max={100} />
            <p>
              {run.progress}% · {run.status}
            </p>
          </section>
        )}
        {run?.status === "not_configured" && (
          <section className="analysis-state analysis-state--warning">
            <AlertTriangle />
            <h2>
              {c(
                "Gemini غير مُعدّ على الخادم",
                "Gemini is not configured on the server",
              )}
            </h2>
            <p>
              {c(
                "يجب إضافة GEMINI_API_KEY في بيئة الخادم ثم إعادة المحاولة. لا توجد نتيجة وهمية.",
                "Add GEMINI_API_KEY to the server environment, then retry. No fake result is shown.",
              )}
            </p>
          </section>
        )}
        {run && ["failed", "stale"].includes(run.status) && (
          <section className="analysis-state analysis-state--warning">
            <AlertTriangle />
            <h2>{c("لم يكتمل التحليل", "Analysis did not complete")}</h2>
            <p>{run.failure_message}</p>
            <button className="secondary-button" onClick={() => void start()}>
              {c("ابدأ تحليلًا جديدًا", "Start a new analysis")}
            </button>
          </section>
        )}
        {run && ["ready", "partial"].includes(run.status) && (
          <>
            {run.is_partial && (
              <p className="analysis-notice">
                <AlertTriangle />
                {c(
                  "هذه نتيجة جزئية لأن بعض الملفات أو المحتوى تجاوز الحدود أو تعذر قراءته.",
                  "This is a partial result because some files or content exceeded limits or could not be read.",
                )}
              </p>
            )}
            <section className="suggestion-list">
              <h2>{c("راجع وحدد المهارات", "Review and select skills")}</h2>
              {run.suggestions.length === 0 && (
                <p>
                  {c(
                    "لم نجد اقتراحات مدعومة بما يكفي. أضف عينة عمل أو كودًا أوضح.",
                    "No sufficiently supported suggestions were found. Add a clearer work sample or code.",
                  )}
                </p>
              )}
              {run.suggestions.map((skill) => (
                <label
                  className={`suggestion-card ${selected.includes(skill.id) ? "is-selected" : ""}`}
                  key={skill.id}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(skill.id)}
                    onChange={() =>
                      setSelected((value) =>
                        value.includes(skill.id)
                          ? value.filter((id) => id !== skill.id)
                          : [...value, skill.id],
                      )
                    }
                  />
                  <div>
                    <span className="scope-pill">
                      {skill.within_assessment_scope
                        ? c("ضمن نطاق التقييم", "In assessment scope")
                        : c(
                            "خارج نطاق التقييم الحالي",
                            "Outside current assessment scope",
                          )}
                    </span>
                    <h3>{skill.skill_name}</h3>
                    <p>{skill.rationale}</p>
                    {skill.references.map((reference, index) => (
                      <blockquote key={index}>
                        {reference.quote ?? reference.observation}
                        <small>
                          {c("الدليل", "Evidence")} #{reference.evidence_id} ·{" "}
                          {reference.kind} {reference.start}
                          {reference.end !== reference.start
                            ? `–${reference.end}`
                            : ""}
                        </small>
                      </blockquote>
                    ))}
                    {skill.limitations.map((limitation) => (
                      <small key={limitation}>⚠ {limitation}</small>
                    ))}
                  </div>
                </label>
              ))}
            </section>
            <button
              className="primary-button analysis-confirm"
              disabled={busy || selected.length === 0}
              onClick={() => void confirm()}
            >
              <Check />
              {c(
                "تأكيد المحدد وإنشاء نسخة Talent DNA",
                "Confirm selected and create a Talent DNA version",
              )}
            </button>
          </>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}

export function DnaPage() {
  const { i18n } = useTranslation();
  const c = (ar: string, en: string) => (i18n.language === "en" ? en : ar);
  const [snapshot, setSnapshot] = useState<DnaSnapshot | null | undefined>();
  useEffect(() => {
    void analysisApi.dna().then((value) => setSnapshot(value.data));
  }, []);
  if (snapshot === undefined)
    return (
      <main className="route-state">
        <LoaderCircle className="spin" />
      </main>
    );
  return (
    <main className="product-page">
      <ProductHeader section="Talent DNA" />
      <section className="dna-shell">
        <header>
          <Dna />
          <span>
            {snapshot
              ? `${c("الإصدار", "Version")} ${snapshot.version}`
              : c("لا توجد نسخة بعد", "No version yet")}
          </span>
          <h1>
            {c(
              "بصمتك مبنية على اختياراتك.",
              "Your DNA is built from your selections.",
            )}
          </h1>
          <p>
            {c(
              "لا توجد درجات أو أحكام جاهزية. كل مهارة مرتبطة بدليل وحدود واضحة.",
              "There are no scores or readiness verdicts. Every skill has evidence and explicit limitations.",
            )}
          </p>
        </header>
        {!snapshot ? (
          <Link className="primary-button" to="/analysis">
            {c("ابدأ تحليل الأدلة", "Start evidence analysis")}
          </Link>
        ) : (
          <div className="dna-grid">
            {snapshot.skills.map((skill) => (
              <Link to={`/dna/skills/${skill.id}`} key={skill.id}>
                <span>
                  {skill.within_assessment_scope
                    ? "Web"
                    : c("إضافية", "Additional")}
                </span>
                <h2>{skill.skill_name}</h2>
                <p>{skill.rationale}</p>
                <small>{c("غير مُقيّمة", "Not assessed")}</small>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export function SkillDetailPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const c = (ar: string, en: string) => (i18n.language === "en" ? en : ar);
  const [skill, setSkill] = useState<DnaSkill | null>(null);
  useEffect(() => {
    if (id)
      void analysisApi.skill(Number(id)).then((value) => setSkill(value.data));
  }, [id]);
  if (!skill)
    return (
      <main className="route-state">
        <LoaderCircle className="spin" />
      </main>
    );
  return (
    <main className="product-page">
      <ProductHeader section={c("تفاصيل المهارة", "Skill detail")} />
      <section className="skill-detail">
        <span>
          {skill.within_assessment_scope
            ? c("ضمن نطاق الويب", "In web scope")
            : c("خارج نطاق التقييم الحالي", "Outside current assessment scope")}
        </span>
        <h1>{skill.skill_name}</h1>
        <p>{skill.rationale}</p>
        <h2>{c("المراجع", "References")}</h2>
        {skill.references.map((reference, index) => (
          <blockquote key={index}>
            {reference.quote ?? reference.observation}
            <small>
              #{reference.evidence_id} · {reference.kind} {reference.start}–
              {reference.end}
            </small>
          </blockquote>
        ))}
        <h2>{c("الحدود", "Limitations")}</h2>
        {skill.limitations.length ? (
          <ul>
            {skill.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>
            {c(
              "لم تُذكر حدود إضافية، لكن المهارة غير مُقيّمة.",
              "No additional limitations were stated, but the skill is not assessed.",
            )}
          </p>
        )}
      </section>
    </main>
  );
}
