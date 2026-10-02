import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleAlert,
  Clock3,
  Code2,
  Compass,
  Dna,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  GitBranch,
  Globe2,
  GraduationCap,
  Layers3,
  Lightbulb,
  LockKeyhole,
  Medal,
  Menu,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UploadCloud,
  UserRound,
  WandSparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import builderDirectionVisual from "../../assets/builder-direction-visual.png";
import builderProjectDna from "../../assets/builder-project-dna.svg";
import logo from "../../assets/talent-dna-logo.png";
import { LanguageToggle } from "../auth/AuthComponents";

type LangCopy = { ar: string; en: string };

function useCopy() {
  const { i18n } = useTranslation();
  const english = i18n.language === "en";
  return (ar: string, en: string) => (english ? en : ar);
}

const builderSteps = [
  { ar: "الاتجاه", en: "Direction", href: "/builder/direction" },
  {
    ar: "المشاريع والخبرة",
    en: "Projects & experience",
    href: "/builder/projects",
  },
  { ar: "الأدلة", en: "Evidence", href: "/builder/evidence" },
  { ar: "رؤيتك", en: "Your view", href: "/builder/vision" },
];

function DirectionArrow({ forward = false }: { forward?: boolean }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== "en";
  const Icon = forward === isRtl ? ArrowLeft : ArrowRight;
  return <Icon aria-hidden="true" size={16} />;
}

export function ProductHeader({
  section = "بناء الملف",
  onBack,
}: {
  section?: string;
  onBack?: () => void;
}) {
  const c = useCopy();
  const navigate = useNavigate();
  return (
    <header className="product-header">
      <LanguageToggle />
      <span className="product-header__section">
        <FileText aria-hidden="true" size={16} /> {section}
      </span>
      <div className="product-header__brand">
        <img src={logo} width="150" height="50" alt="Talent DNA AI" />
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(-1))}
        >
          {c("رجوع", "Back")} <DirectionArrow />
        </button>
      </div>
    </header>
  );
}

function BuilderProgress({ current }: { current: number }) {
  const c = useCopy();
  return (
    <section
      className="builder-progress"
      aria-label={c("تقدم بناء الملف", "Profile progress")}
    >
      <strong>{c("منشئ الملف الشخصي", "Profile builder")}</strong>
      <span>{c(`الخطوة ${current} من 4`, `Step ${current} of 4`)}</span>
      <ol>
        {builderSteps.map((step, index) => {
          const number = index + 1;
          return (
            <li
              key={step.href}
              className={number <= current ? "is-active" : ""}
            >
              <Link
                to={step.href}
                aria-current={number === current ? "step" : undefined}
              >
                <i>{number < current ? <Check size={15} /> : number}</i>
                <span>{c(step.ar, step.en)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function BuilderAside({ step }: { step: number }) {
  const c = useCopy();
  if (step === 1)
    return (
      <aside className="builder-aside builder-aside--portrait">
        <img src={builderDirectionVisual} alt="" />
      </aside>
    );
  if (step === 2)
    return (
      <aside className="builder-aside builder-aside--dna">
        <img src={builderProjectDna} alt="" />
        <span className="builder-orbit builder-orbit--one">
          {c("المشاريع", "Projects")}
        </span>
        <span className="builder-orbit builder-orbit--two">
          {c("القدرات", "Capabilities")}
        </span>
        <h3>{c("بناء Talent DNA الخاص بك", "Build your Talent DNA")}</h3>
        <div className="builder-ai-note">
          <WandSparkles size={20} />
          <strong>
            {c("إشارات القدرات بالذكاء الاصطناعي", "AI capability signals")}
          </strong>
          <p>
            {c(
              "كل مشروع تضيفه يساعد على تحليل إشارات أدق.",
              "Every project helps surface sharper capability signals.",
            )}
          </p>
        </div>
      </aside>
    );
  if (step === 3)
    return (
      <aside className="builder-aside builder-aside--flow">
        <div className="evidence-flow">
          <div>
            <FileText />
            <GitBranch />
            <Globe2 />
          </div>
          <span />
          <strong>
            <BrainCircuit size={19} />{" "}
            {c("تحليل الذكاء الاصطناعي", "AI analysis")}
          </strong>
          <span />
          <em>{c("إشارات القدرة", "Capability signals")}</em>
          <span />
          <b>
            <Dna size={18} /> Talent DNA
          </b>
        </div>
        <div className="builder-ai-note">
          <ShieldCheck />
          <strong>
            {c(
              "لا تدعم الأدلة الإشارات تلقائيًا، بل تثبت ذلك.",
              "Evidence does not auto-approve signals; it proves them.",
            )}
          </strong>
        </div>
      </aside>
    );
  return (
    <aside className="builder-aside builder-aside--vision">
      <div className="vision-orb">
        <Dna size={72} />
      </div>
      <h3>
        {c(
          "صورتك المهنية تبدأ بالوضوح",
          "Your professional picture starts with clarity",
        )}
      </h3>
      <p>
        {c(
          "راجع ما أدخلته وحدد ما تريد أن يعرفه Talent DNA عنك.",
          "Review your inputs and decide what Talent DNA should understand about you.",
        )}
      </p>
      <div className="mini-signal-grid">
        <span>01 {c("اتجاه", "Direction")}</span>
        <span>02 {c("مشروع", "Project")}</span>
        <span>03 {c("دليل", "Evidence")}</span>
        <span>04 {c("رؤية", "View")}</span>
      </div>
    </aside>
  );
}

function Field({
  label,
  placeholder,
  wide = false,
  textarea = false,
}: {
  label: string;
  placeholder: string;
  wide?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className={`builder-field${wide ? " builder-field--wide" : ""}`}>
      <span>{label}</span>
      {textarea ? (
        <textarea placeholder={placeholder} rows={3} />
      ) : (
        <input placeholder={placeholder} />
      )}
    </label>
  );
}

const builderContent: Record<
  number,
  { eyebrow: LangCopy; title: LangCopy; accent: LangCopy; body: LangCopy }
> = {
  1: {
    eyebrow: { ar: "الاتجاه", en: "Direction" },
    title: { ar: "إلى أين", en: "Where are you" },
    accent: { ar: "تتجه؟", en: "headed?" },
    body: {
      ar: "امنح Talent DNA سياقًا كافيًا لفهم الاتجاه الذي تريد النمو نحوه.",
      en: "Give Talent DNA enough context to understand where you want to grow.",
    },
  },
  2: {
    eyebrow: { ar: "المشاريع والخبرة", en: "Projects & experience" },
    title: { ar: "ما الذي قمت", en: "What have you" },
    accent: { ar: "ببنائه فعلًا؟", en: "actually built?" },
    body: {
      ar: "تمنح المشاريع Talent DNA سياقًا عن نشاط حقيقي، لا مجرد مسميات أو ادعاءات.",
      en: "Projects give Talent DNA context from real work—not just labels or claims.",
    },
  },
  3: {
    eyebrow: { ar: "الأدلة", en: "Evidence" },
    title: {
      ar: "أضف أدلة تمنح ملفك",
      en: "Add evidence that gives your profile",
    },
    accent: { ar: "سياقًا أكبر.", en: "more context." },
    body: {
      ar: "قد تعزز الأدلة إشارة قدرة، لكن الملف أو الرابط لا يثبت القدرة تلقائيًا.",
      en: "Evidence may strengthen a capability signal, but a file or link never proves it automatically.",
    },
  },
  4: {
    eyebrow: { ar: "رؤيتك", en: "Your view" },
    title: { ar: "ما الذي تريد أن", en: "What do you want to" },
    accent: { ar: "يعكسه ملفك؟", en: "be known for?" },
    body: {
      ar: "ساعدنا على فهم نقاط القوة التي تريد تطويرها وكيف ترى نفسك اليوم.",
      en: "Help us understand the strengths you want to grow and how you see yourself today.",
    },
  },
};

function DirectionForm() {
  const c = useCopy();
  return (
    <div className="builder-form-grid">
      <Field
        wide
        label={c("الاسم الكامل", "Full name")}
        placeholder={c("اسمك بالكامل", "Your full name")}
      />
      <Field
        label={c("المرحلة الحالية", "Current stage")}
        placeholder={c("اختر المرحلة", "Choose a stage")}
      />
      <Field
        label={c("الاتجاه المهني", "Career direction")}
        placeholder={c("مثال: تطوير البرمجيات", "e.g. Software development")}
      />
      <Field
        wide
        label={c("الاهتمام المهني", "Professional interest")}
        placeholder="Mobile application development"
      />
    </div>
  );
}

function ProjectForm() {
  const c = useCopy();
  const [projects, setProjects] = useState(1);
  return (
    <>
      <div className="builder-form-grid">
        <Field
          wide
          label={c("عنوان المشروع", "Project title")}
          placeholder={c("عنوان المشروع", "Project title")}
        />
        <Field
          wide
          label={c("وصف مختصر", "Short description")}
          placeholder={c("وصف مختصر", "Short description")}
        />
        <Field
          wide
          textarea
          label={c("ما الذي قمت بفعله؟", "What did you do?")}
          placeholder={c("صف مساهمتك", "Describe your contribution")}
        />
        <Field
          label={c("دورك", "Your role")}
          placeholder={c("دورك", "Your role")}
        />
        <Field
          label={c("الأدوات / التقنيات", "Tools / technologies")}
          placeholder={c("الأدوات / التقنيات", "Tools / technologies")}
        />
        <Field
          wide
          label={c("ما الذي قمت بإنجازه؟", "What did you achieve?")}
          placeholder={c("النتيجة أو الأثر", "Result or impact")}
        />
      </div>
      <button
        className="builder-add"
        type="button"
        onClick={() => setProjects((value) => value + 1)}
      >
        <Plus size={17} />{" "}
        {c(
          `إضافة مشروع أو خبرة${projects > 1 ? ` (${projects})` : ""}`,
          `Add a project or experience${projects > 1 ? ` (${projects})` : ""}`,
        )}
      </button>
      <div className="builder-chain">
        <span>{c("المشروع", "Project")}</span>
        <i />
        <span>{c("الدليل", "Evidence")}</span>
        <i />
        <span>{c("القدرة", "Capability")}</span>
        <p>
          {c(
            "يمكنك ربط كل مشروع بالأدلة الداعمة في الخطوة التالية.",
            "You can connect each project to supporting evidence in the next step.",
          )}
        </p>
      </div>
    </>
  );
}

function EvidenceForm() {
  const c = useCopy();
  const [items, setItems] = useState([
    "Layan_Khalil_CV.pdf",
    "GitHub Profile",
    "Portfolio",
    "Campus Events Repository",
  ]);
  const icons = [FileText, GitBranch, Globe2, Code2];
  return (
    <div className="evidence-list">
      <div className="upload-drop">
        <UploadCloud />
        <strong>
          {c(
            "اسحب الملفات هنا أو اختر من جهازك",
            "Drop files here or choose from your device",
          )}
        </strong>
        <span>{c("ملفات PDF وروابط الأعمال", "PDF files and work links")}</span>
      </div>
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];
        return (
          <article key={`${item}-${index}`}>
            <Icon />
            <div>
              <strong>{item}</strong>
              <small>
                {index === 0
                  ? c("تم الرفع · خاص", "Uploaded · Private")
                  : "github.com/layan-demo"}
              </small>
            </div>
            <span>{c("خاص", "Private")}</span>
            <button
              type="button"
              aria-label={c("حذف", "Remove")}
              onClick={() =>
                setItems((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              <X size={16} />
            </button>
          </article>
        );
      })}
      <button
        className="secondary-button"
        type="button"
        onClick={() =>
          setItems((current) => [...current, c("دليل جديد", "New evidence")])
        }
      >
        <Plus size={16} /> {c("إضافة دليل", "Add evidence")}
      </button>
    </div>
  );
}

function VisionForm() {
  const c = useCopy();
  const [selected, setSelected] = useState([0, 2]);
  const strengths = [
    c("حل المشكلات", "Problem solving"),
    c("التواصل", "Communication"),
    c("التفكير الإبداعي", "Creative thinking"),
    c("التعلم السريع", "Fast learning"),
    c("العمل الجماعي", "Teamwork"),
    c("القيادة", "Leadership"),
  ];
  return (
    <div className="vision-form">
      <h3>
        {c(
          "اختر نقاط القوة الأقرب إليك",
          "Choose the strengths that feel closest to you",
        )}
      </h3>
      <div className="choice-grid">
        {strengths.map((strength, index) => (
          <button
            className={selected.includes(index) ? "is-selected" : ""}
            type="button"
            key={strength}
            onClick={() =>
              setSelected((current) =>
                current.includes(index)
                  ? current.filter((item) => item !== index)
                  : [...current, index],
              )
            }
          >
            <CheckCircle2 size={18} />
            {strength}
          </button>
        ))}
      </div>
      <Field
        wide
        textarea
        label={c("كيف تريد أن تنمو؟", "How do you want to grow?")}
        placeholder={c(
          "اكتب رؤيتك للمرحلة القادمة",
          "Describe your next chapter",
        )}
      />
    </div>
  );
}

export function BuilderPage({ step }: { step: 1 | 2 | 3 | 4 }) {
  const c = useCopy();
  const navigate = useNavigate();
  const content = builderContent[step];
  const form =
    step === 1 ? (
      <DirectionForm />
    ) : step === 2 ? (
      <ProjectForm />
    ) : step === 3 ? (
      <EvidenceForm />
    ) : (
      <VisionForm />
    );
  const next = step === 4 ? "/review" : builderSteps[step].href;
  const previous = step === 1 ? "/" : builderSteps[step - 2].href;
  return (
    <main className="product-page builder-page">
      <ProductHeader section={c("بناء الملف", "Profile builder")} />
      <BuilderProgress current={step} />
      <section className="builder-card">
        <BuilderAside step={step} />
        <div className="builder-content">
          <div className="builder-content__meta">
            <span>
              <Save size={14} /> {c("تم الحفظ", "Saved")}
            </span>
            <b>{c(content.eyebrow.ar, content.eyebrow.en)}</b>
          </div>
          <h1>
            {c(content.title.ar, content.title.en)}{" "}
            <em>{c(content.accent.ar, content.accent.en)}</em>
          </h1>
          <p className="builder-lead">{c(content.body.ar, content.body.en)}</p>
          <div className="builder-form-card">{form}</div>
          <div className="builder-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate(next)}
            >
              {c(
                step === 4 ? "مراجعة الملف" : "متابعة",
                step === 4 ? "Review profile" : "Continue",
              )}{" "}
              <DirectionArrow forward />
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => navigate(previous)}
            >
              {c("رجوع", "Back")} <DirectionArrow />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

const summaryItems = [
  {
    icon: Compass,
    ar: "اتجاهك",
    en: "Your direction",
    valueAr: "تطوير تطبيقات الهاتف",
    valueEn: "Mobile application development",
  },
  {
    icon: Layers3,
    ar: "المشاريع والخبرة",
    en: "Projects & experience",
    valueAr: "3 عناصر مضافة",
    valueEn: "3 items added",
  },
  {
    icon: FileCheck2,
    ar: "الأدلة",
    en: "Evidence",
    valueAr: "4 أدلة خاصة",
    valueEn: "4 private items",
  },
  {
    icon: Target,
    ar: "رؤيتك",
    en: "Your view",
    valueAr: "4 نقاط قوة",
    valueEn: "4 strengths",
  },
];

export function ReviewPage() {
  const c = useCopy();
  const navigate = useNavigate();
  return (
    <main className="product-page">
      <ProductHeader section={c("مراجعة الملف", "Profile review")} />
      <section className="review-shell">
        <div className="review-heading">
          <span>
            <ShieldCheck size={17} />{" "}
            {c("المراجعة قبل التحليل", "Review before analysis")}
          </span>
          <h1>
            {c("راجع قصتك قبل أن نبدأ.", "Review your story before we begin.")}
          </h1>
          <p>
            {c(
              "يمكنك تعديل أي قسم. لن تُنشر بياناتك أو أدلتك أثناء التحليل.",
              "You can edit any section. Your profile and evidence remain private during analysis.",
            )}
          </p>
        </div>
        <div className="review-grid">
          {summaryItems.map(({ icon: Icon, ...item }, index) => (
            <article key={item.en}>
              <div className="review-icon">
                <Icon />
              </div>
              <div>
                <small>0{index + 1}</small>
                <h2>{c(item.ar, item.en)}</h2>
                <p>{c(item.valueAr, item.valueEn)}</p>
              </div>
              <Link to={builderSteps[index].href}>{c("تعديل", "Edit")}</Link>
            </article>
          ))}
        </div>
        <div className="review-consent">
          <BrainCircuit />
          <div>
            <strong>
              {c(
                "التحليل يقترح إشارات، وأنت تراجعها.",
                "Analysis suggests signals; you review them.",
              )}
            </strong>
            <p>
              {c(
                "لا تتحول أي إشارة إلى حقيقة مؤكدة تلقائيًا.",
                "No signal becomes a confirmed fact automatically.",
              )}
            </p>
          </div>
        </div>
        <button
          className="primary-button review-submit"
          type="button"
          onClick={() => navigate("/analysis/queued")}
        >
          <WandSparkles />{" "}
          {c("ابدأ تحليل Talent DNA", "Start Talent DNA analysis")}
        </button>
      </section>
    </main>
  );
}

type AnalysisState = "queued" | "failure" | "empty" | "confirmation";
const analysisCopy: Record<
  AnalysisState,
  { icon: LucideIcon; title: LangCopy; body: LangCopy }
> = {
  queued: {
    icon: Clock3,
    title: { ar: "تحليلك في الطريق.", en: "Your analysis is on its way." },
    body: {
      ar: "نحوّل مشاريعك وأدلتك إلى إشارات قدرات قابلة للمراجعة.",
      en: "We are turning your projects and evidence into reviewable capability signals.",
    },
  },
  failure: {
    icon: CircleAlert,
    title: {
      ar: "تعذر إكمال التحليل.",
      en: "We could not complete the analysis.",
    },
    body: {
      ar: "لم نفقد مدخلاتك. أعد المحاولة أو ارجع لمراجعة الأدلة.",
      en: "Your inputs are safe. Try again or return to review your evidence.",
    },
  },
  empty: {
    icon: Sparkles,
    title: {
      ar: "نحتاج سياقًا أكثر قليلًا.",
      en: "We need a little more context.",
    },
    body: {
      ar: "أضف مشروعًا أو دليلًا أوضح لنتمكن من اقتراح إشارات مفيدة.",
      en: "Add a project or clearer evidence so we can suggest useful signals.",
    },
  },
  confirmation: {
    icon: CheckCircle2,
    title: {
      ar: "وجدنا إشارات تستحق مراجعتك.",
      en: "We found signals worth reviewing.",
    },
    body: {
      ar: "اختر ما يعكس قدراتك فعلًا. يمكنك فتح كل إشارة لمعرفة مصدرها.",
      en: "Select what genuinely reflects you. Open any signal to see its source.",
    },
  },
};

export function AnalysisPage({ state }: { state: AnalysisState }) {
  const c = useCopy();
  const navigate = useNavigate();
  const info = analysisCopy[state];
  const Icon = info.icon;
  const [signals, setSignals] = useState([true, true, false, true]);
  const labels = [
    c("التفكير التحليلي", "Analytical thinking"),
    c("حل المشكلات", "Problem solving"),
    c("التواصل", "Communication"),
    c("التعلم السريع", "Fast learning"),
  ];
  return (
    <main className="product-page">
      <ProductHeader section={c("تحليل Talent DNA", "Talent DNA analysis")} />
      <section className={`analysis-card analysis-card--${state}`}>
        <div className="analysis-symbol">
          <Icon size={46} />
        </div>
        <span className="analysis-badge">
          {c("تحليل بالذكاء الاصطناعي", "AI-assisted analysis")}
        </span>
        <h1>{c(info.title.ar, info.title.en)}</h1>
        <p>{c(info.body.ar, info.body.en)}</p>
        {state === "queued" && (
          <div className="analysis-loader">
            <i />
            <i />
            <i />
            <span>
              {c(
                "تحليل الأدلة وربط الإشارات…",
                "Analyzing evidence and connecting signals…",
              )}
            </span>
          </div>
        )}
        {state === "confirmation" && (
          <div className="signal-review">
            {labels.map((label, index) => (
              <button
                type="button"
                className={signals[index] ? "is-selected" : ""}
                key={label}
                onClick={() =>
                  setSignals((current) =>
                    current.map((value, itemIndex) =>
                      itemIndex === index ? !value : value,
                    ),
                  )
                }
              >
                <span>
                  <BrainCircuit size={18} />
                  <b>{label}</b>
                </span>
                <em>
                  {signals[index]
                    ? c("محدد", "Selected")
                    : c("غير محدد", "Not selected")}
                </em>
              </button>
            ))}
          </div>
        )}
        <div className="analysis-actions">
          {state === "queued" && (
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate("/analysis/confirmation")}
            >
              {c("عرض النتيجة التجريبية", "View preview result")}
            </button>
          )}
          {state === "failure" && (
            <button className="primary-button" type="button">
              <RefreshCw /> {c("إعادة المحاولة", "Try again")}
            </button>
          )}
          {state === "empty" && (
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate("/builder/projects")}
            >
              <Plus /> {c("إضافة سياق", "Add context")}
            </button>
          )}
          {state === "confirmation" && (
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate("/dna")}
            >
              <Check />{" "}
              {c("تأكيد وبناء Talent DNA", "Confirm and build Talent DNA")}
            </button>
          )}
          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate("/review")}
          >
            {c("العودة للمراجعة", "Back to review")}
          </button>
        </div>
      </section>
    </main>
  );
}

const dashboardLinks = [
  { to: "/dna", icon: Dna, ar: "Talent DNA", en: "Talent DNA" },
  { to: "/readiness", icon: Rocket, ar: "الاستعداد", en: "Readiness" },
  { to: "/assessment", icon: BrainCircuit, ar: "التقييم", en: "Assessment" },
  { to: "/results", icon: BarChart3, ar: "النتائج", en: "Results" },
  {
    to: "/opportunities",
    icon: BriefcaseBusiness,
    ar: "الفرص",
    en: "Opportunities",
  },
  { to: "/card-builder/private", icon: FileText, ar: "بطاقتي", en: "My card" },
];

function DashboardShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const c = useCopy();
  const [menu, setMenu] = useState(false);
  return (
    <main className="dashboard-page">
      <header className="dashboard-top">
        <button
          className="dashboard-menu"
          type="button"
          onClick={() => setMenu((value) => !value)}
        >
          <Menu />
        </button>
        <LanguageToggle />
        <h1>{title}</h1>
        <img src={logo} width="150" height="50" alt="Talent DNA AI" />
      </header>
      <div className="dashboard-layout">
        <aside className={`dashboard-nav${menu ? " is-open" : ""}`}>
          <div className="dashboard-user">
            <span>LK</span>
            <div>
              <strong>LAYAN KHALIL</strong>
              <small>{c("ملف قيد النمو", "Growing profile")}</small>
            </div>
          </div>
          <nav>
            {dashboardLinks.map(({ icon: Icon, ...link }) => (
              <Link key={link.to} to={link.to} onClick={() => setMenu(false)}>
                <Icon size={19} /> {c(link.ar, link.en)}
              </Link>
            ))}
          </nav>
          <Link className="dashboard-privacy" to="/privacy/private">
            <LockKeyhole size={18} /> {c("الخصوصية", "Privacy")}
          </Link>
        </aside>
        <section className="dashboard-main">{children}</section>
      </div>
    </main>
  );
}

const capabilities = [
  {
    key: "creative",
    ar: "التفكير الإبداعي",
    en: "Creative thinking",
    value: 92,
    color: "#8e51ff",
  },
  {
    key: "problem",
    ar: "حل المشكلات",
    en: "Problem solving",
    value: 89,
    color: "#165dfc",
  },
  {
    key: "communication",
    ar: "التواصل",
    en: "Communication",
    value: 84,
    color: "#43c2f2",
  },
  {
    key: "adaptability",
    ar: "القدرة على التكيف",
    en: "Adaptability",
    value: 91,
    color: "#ad46ff",
  },
  {
    key: "technical",
    ar: "المهارات التقنية",
    en: "Technical skills",
    value: 87,
    color: "#6254ff",
  },
];

export function DnaPage() {
  const c = useCopy();
  return (
    <DashboardShell title={c("Talent DNA الخاص بك", "Your Talent DNA")}>
      <div className="dashboard-hero">
        <span>
          <Sparkles size={17} />{" "}
          {c("بصمتك المهنية", "Your capability fingerprint")}
        </span>
        <h2>
          {c(
            "قدراتك، مدعومة بالسياق.",
            "Your capabilities, backed by context.",
          )}
        </h2>
        <p>
          {c(
            "صورة حية تتطور مع مشاريعك وأدلتك وتقييماتك.",
            "A living picture that grows with your projects, evidence, and assessments.",
          )}
        </p>
      </div>
      <div className="dna-overview">
        <article className="talent-score">
          <div className="dna-pentagon">
            <Dna />
          </div>
          <small>{c("درجة الموهبة", "Talent Score")}</small>
          <strong>88%</strong>
          <p>{c("ملف قوي ومتوازن", "Strong, balanced profile")}</p>
        </article>
        <section className="capability-list">
          <div className="section-title">
            <div>
              <span>{c("خريطة القدرات", "Capability map")}</span>
              <h3>{c("أقوى إشاراتك", "Your strongest signals")}</h3>
            </div>
            <Link to="/readiness">
              {c("تابع رحلة الاستعداد", "Continue readiness")}{" "}
              <DirectionArrow forward />
            </Link>
          </div>
          {capabilities.map((skill) => (
            <Link
              className="capability-row"
              to={`/dna/skills/${skill.key}`}
              key={skill.key}
            >
              <span>{c(skill.ar, skill.en)}</span>
              <div>
                <i
                  style={{ width: `${skill.value}%`, background: skill.color }}
                />
              </div>
              <b>{skill.value}%</b>
              <ChevronLeft size={17} />
            </Link>
          ))}
        </section>
      </div>
      <div className="insight-grid">
        <article>
          <FileCheck2 />
          <strong>4</strong>
          <span>{c("أدلة مرتبطة", "Linked evidence")}</span>
        </article>
        <article>
          <Layers3 />
          <strong>3</strong>
          <span>{c("مشاريع محللة", "Projects analyzed")}</span>
        </article>
        <article>
          <Medal />
          <strong>5</strong>
          <span>{c("إشارات مؤكدة", "Confirmed signals")}</span>
        </article>
        <article>
          <Target />
          <strong>2</strong>
          <span>{c("فرص متوافقة", "Matching opportunities")}</span>
        </article>
      </div>
    </DashboardShell>
  );
}

export function SkillDetailPage() {
  const c = useCopy();
  return (
    <DashboardShell title={c("تفاصيل المهارة", "Skill detail")}>
      <Link className="inline-back" to="/dna">
        <DirectionArrow /> {c("العودة إلى Talent DNA", "Back to Talent DNA")}
      </Link>
      <div className="skill-detail">
        <section className="skill-detail__hero">
          <div className="skill-ring">
            <Lightbulb />
            <strong>92%</strong>
          </div>
          <span>{c("قدرة أساسية", "Core capability")}</span>
          <h2>{c("التفكير الإبداعي", "Creative thinking")}</h2>
          <p>
            {c(
              "القدرة على توليد أفكار جديدة وربط الأنماط وتحويل القيود إلى حلول قابلة للتطبيق.",
              "The ability to generate original ideas, connect patterns, and turn constraints into useful solutions.",
            )}
          </p>
        </section>
        <section className="skill-detail__signals">
          <h3>{c("لماذا ظهرت هذه الإشارة؟", "Why this signal appeared")}</h3>
          {[
            {
              icon: Layers3,
              title: c("مشروع تطبيق الجامعة", "Campus app project"),
              body: c(
                "إعادة تصميم تدفق تجربة الطالب",
                "Redesigned the student experience flow",
              ),
            },
            {
              icon: GitBranch,
              title: "GitHub Repository",
              body: c(
                "نماذج أولية وتجارب متعددة",
                "Multiple prototypes and experiments",
              ),
            },
            {
              icon: BrainCircuit,
              title: c("تحليل الذكاء الاصطناعي", "AI analysis"),
              body: c(
                "نمط متكرر من بناء البدائل",
                "A recurring pattern of building alternatives",
              ),
            },
          ].map(({ icon: Icon, title, body }) => (
            <article key={title}>
              <Icon />
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
              <span>{c("دليل", "Evidence")}</span>
            </article>
          ))}
        </section>
      </div>
      <section className="skill-growth">
        <h3>{c("كيف تطور هذه القدرة؟", "How to grow this capability")}</h3>
        <div>
          <article>
            <span>01</span>
            <strong>{c("جرّب قيودًا جديدة", "Try new constraints")}</strong>
            <p>
              {c(
                "ابنِ حلًا بأدوات أو وقت أقل.",
                "Build a solution with fewer tools or less time.",
              )}
            </p>
          </article>
          <article>
            <span>02</span>
            <strong>{c("وثّق البدائل", "Document alternatives")}</strong>
            <p>
              {c(
                "احتفظ بالمسارات التي استبعدتها ولماذا.",
                "Keep the paths you rejected and why.",
              )}
            </p>
          </article>
          <article>
            <span>03</span>
            <strong>{c("اطلب نقدًا مبكرًا", "Ask for early critique")}</strong>
            <p>
              {c(
                "شارك الفكرة قبل اكتمالها.",
                "Share the idea before it feels finished.",
              )}
            </p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}

export function ReadinessPage({ resume = false }: { resume?: boolean }) {
  const c = useCopy();
  const navigate = useNavigate();
  return (
    <DashboardShell title={c("الاستعداد المهني", "Career readiness")}>
      <section className="readiness-hero">
        <span>
          <Rocket /> {c("رحلة الاستعداد", "Readiness journey")}
        </span>
        <h2>
          {resume
            ? c("أكمل من حيث توقفت.", "Continue where you left off.")
            : c(
                "استعد لفرصتك القادمة.",
                "Get ready for your next opportunity.",
              )}
        </h2>
        <p>
          {c(
            "رحلة قصيرة تجمع بين ملفك وتقييم عملي لتمنحك صورة أوضح عن جاهزيتك.",
            "A focused journey combining your profile with a practical assessment for a clearer view of your readiness.",
          )}
        </p>
        <button
          className="primary-button"
          type="button"
          onClick={() => navigate("/assessment")}
        >
          {resume
            ? c("متابعة التقييم", "Resume assessment")
            : c("ابدأ رحلة الاستعداد", "Start readiness journey")}{" "}
          <DirectionArrow forward />
        </button>
      </section>
      <div className="readiness-roadmap">
        {[
          { icon: Dna, ar: "ملف Talent DNA", en: "Talent DNA profile" },
          { icon: BrainCircuit, ar: "تقييم قصير", en: "Short assessment" },
          { icon: BarChart3, ar: "نتيجة واضحة", en: "Clear result" },
          {
            icon: BriefcaseBusiness,
            ar: "فرص مناسبة",
            en: "Relevant opportunities",
          },
        ].map(({ icon: Icon, ...item }, index) => (
          <article
            key={item.en}
            className={resume && index === 1 ? "is-current" : ""}
          >
            <i>
              <Icon />
            </i>
            <span>0{index + 1}</span>
            <strong>{c(item.ar, item.en)}</strong>
            <p>
              {c(
                "خطوة عملية مرتبطة بملفك.",
                "A practical step connected to your profile.",
              )}
            </p>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}

export function AssessmentPage({
  mode = "question",
}: {
  mode?: "question" | "resume" | "fail";
}) {
  const c = useCopy();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState(1);
  if (mode === "fail")
    return (
      <DashboardShell title={c("التقييم", "Assessment")}>
        <section className="assessment-state">
          <CircleAlert />
          <h2>
            {c("لم يتم حفظ هذه المحاولة.", "This attempt was not saved.")}
          </h2>
          <p>
            {c(
              "حدث انقطاع أثناء الإرسال. يمكنك البدء مجددًا دون أن يؤثر ذلك على ملفك.",
              "The connection dropped during submission. You can restart without affecting your profile.",
            )}
          </p>
          <button
            className="primary-button"
            type="button"
            onClick={() => navigate("/assessment")}
          >
            <RefreshCw /> {c("إعادة التقييم", "Restart assessment")}
          </button>
        </section>
      </DashboardShell>
    );
  return (
    <DashboardShell title={c("تقييم القدرات", "Capability assessment")}>
      <div className="assessment-top">
        <div>
          <span>{c("التقييم العملي", "Practical assessment")}</span>
          <h2>
            {mode === "resume"
              ? c("مرحبًا بعودتك", "Welcome back")
              : c("كيف تتعامل مع الموقف؟", "How would you approach this?")}
          </h2>
        </div>
        <strong>{mode === "resume" ? "40%" : "3 / 8"}</strong>
      </div>
      <div className="assessment-progress">
        <i style={{ width: mode === "resume" ? "40%" : "37.5%" }} />
      </div>
      <section className="question-card">
        <span>
          <BrainCircuit /> {c("حل المشكلات", "Problem solving")}
        </span>
        <h3>
          {c(
            "لاحظ فريقك أن المستخدمين ينسحبون من خطوة إنشاء الحساب. ما أول شيء ستفعله؟",
            "Your team notices users dropping out during account creation. What would you do first?",
          )}
        </h3>
        <div className="answer-grid">
          {[
            c(
              "أعيد تصميم الصفحة كاملة فورًا",
              "Redesign the entire page immediately",
            ),
            c(
              "أراجع البيانات وأتحدث مع مستخدمين لفهم نقطة التعثر",
              "Review the data and talk to users to understand the friction",
            ),
            c("أضيف خصمًا للمستخدمين الجدد", "Add a discount for new users"),
            c("أزيل التحقق من الحساب", "Remove account verification"),
          ].map((option, index) => (
            <button
              className={answer === index ? "is-selected" : ""}
              type="button"
              key={option}
              onClick={() => setAnswer(index)}
            >
              <i>{String.fromCharCode(65 + index)}</i>
              <span>{option}</span>
              {answer === index && <CheckCircle2 />}
            </button>
          ))}
        </div>
        <div className="question-actions">
          <button
            className="primary-button"
            type="button"
            onClick={() => navigate("/results")}
          >
            {c("إرسال الإجابة", "Submit answer")} <DirectionArrow forward />
          </button>
          <button className="secondary-button" type="button">
            {c("حفظ والمتابعة لاحقًا", "Save and continue later")}
          </button>
        </div>
      </section>
    </DashboardShell>
  );
}

export function ResultPage() {
  const c = useCopy();
  return (
    <DashboardShell title={c("نتيجة الاستعداد", "Readiness result")}>
      <section className="result-hero">
        <div className="result-score">
          <Trophy />
          <strong>86</strong>
          <span>/100</span>
        </div>
        <div>
          <span>
            <Sparkles /> {c("جاهز للخطوة التالية", "Ready for the next step")}
          </span>
          <h2>
            {c(
              "لديك أساس قوي وفرص واضحة للنمو.",
              "You have a strong foundation and clear room to grow.",
            )}
          </h2>
          <p>
            {c(
              "تعكس النتيجة ملفك وإجابات التقييم الحالي، وليست حكمًا ثابتًا على قدراتك.",
              "This result reflects your current profile and assessment answers—not a permanent judgment.",
            )}
          </p>
        </div>
      </section>
      <div className="result-grid">
        <section>
          <h3>{c("ملخص القدرات", "Capability summary")}</h3>
          {capabilities.slice(0, 4).map((skill) => (
            <div className="result-bar" key={skill.key}>
              <span>{c(skill.ar, skill.en)}</span>
              <i>
                <b style={{ width: `${skill.value}%` }} />
              </i>
              <strong>{skill.value}%</strong>
            </div>
          ))}
        </section>
        <section>
          <h3>{c("أهم توصيات النمو", "Top growth recommendations")}</h3>
          {[
            {
              icon: Target,
              ar: "قدّم أمثلة أوضح على قراراتك",
              en: "Show clearer examples of your decisions",
            },
            {
              icon: FileCheck2,
              ar: "أضف دليلًا قابلًا للقياس",
              en: "Add measurable evidence",
            },
            {
              icon: GraduationCap,
              ar: "أكمل تقييم التواصل",
              en: "Complete the communication assessment",
            },
          ].map(({ icon: Icon, ...item }, index) => (
            <article key={item.en}>
              <i>0{index + 1}</i>
              <Icon />
              <strong>{c(item.ar, item.en)}</strong>
            </article>
          ))}
        </section>
      </div>
      <div className="result-actions">
        <Link className="primary-button" to="/opportunities">
          {c("استكشف الفرص", "Explore opportunities")}{" "}
          <DirectionArrow forward />
        </Link>
        <Link className="secondary-button" to="/dna">
          {c("عرض Talent DNA", "View Talent DNA")}
        </Link>
      </div>
    </DashboardShell>
  );
}

const opportunities = [
  {
    role: "Junior Product Designer",
    company: "Nexa Labs",
    match: 94,
    location: "Remote",
  },
  {
    role: "UX Research Associate",
    company: "Orbit Digital",
    match: 89,
    location: "Riyadh",
  },
  {
    role: "Product Analyst",
    company: "Blueframe",
    match: 86,
    location: "Hybrid",
  },
];

export function OpportunitiesPage() {
  const c = useCopy();
  const [saved, setSaved] = useState<number[]>([1]);
  return (
    <DashboardShell title={c("الفرص المناسبة", "Matching opportunities")}>
      <div className="opportunities-heading">
        <div>
          <span>
            <Compass />{" "}
            {c("مطابقة قائمة على القدرات", "Capability-based matching")}
          </span>
          <h2>
            {c(
              "فرص تتوافق مع Talent DNA الخاص بك.",
              "Opportunities aligned with your Talent DNA.",
            )}
          </h2>
        </div>
        <button className="secondary-button">
          <Target /> {c("تعديل التفضيلات", "Edit preferences")}
        </button>
      </div>
      <div className="opportunity-layout">
        <section className="opportunity-list">
          {opportunities.map((item, index) => (
            <article key={item.role}>
              <div className="company-mark">{item.company.slice(0, 1)}</div>
              <div className="opportunity-copy">
                <span>
                  {item.company} · {item.location}
                </span>
                <h3>{item.role}</h3>
                <div>
                  <small>{c("حل المشكلات", "Problem solving")}</small>
                  <small>{c("التواصل", "Communication")}</small>
                  <small>{c("الإبداع", "Creativity")}</small>
                </div>
              </div>
              <div className="match-score">
                <strong>{item.match}%</strong>
                <span>{c("توافق", "Match")}</span>
              </div>
              <button
                type="button"
                className={saved.includes(index) ? "is-saved" : ""}
                onClick={() =>
                  setSaved((current) =>
                    current.includes(index)
                      ? current.filter((value) => value !== index)
                      : [...current, index],
                  )
                }
              >
                <Star fill={saved.includes(index) ? "currentColor" : "none"} />
              </button>
            </article>
          ))}
        </section>
        <aside className="match-explainer">
          <BrainCircuit />
          <h3>{c("لماذا هذه الفرص؟", "Why these opportunities?")}</h3>
          <p>
            {c(
              "نقارن إشارات قدراتك ومتطلبات الدور، ثم نعرض أسباب المطابقة بوضوح.",
              "We compare your capability signals with role requirements and make the reasons visible.",
            )}
          </p>
          <ul>
            <li>
              {c("4 قدرات أساسية متوافقة", "4 core capabilities aligned")}
            </li>
            <li>{c("خبرتان مرتبطتان", "2 relevant experiences")}</li>
            <li>{c("فجوة واحدة قابلة للتطوير", "1 growth area")}</li>
          </ul>
        </aside>
      </div>
    </DashboardShell>
  );
}

type Visibility = "private" | "live" | "revoked";
const visibilityCopy: Record<Visibility, LangCopy> = {
  private: { ar: "خاصة", en: "Private" },
  live: { ar: "منشورة", en: "Live" },
  revoked: { ar: "تم إيقافها", en: "Revoked" },
};

function PublicTalentCard({ compact = false }: { compact?: boolean }) {
  const c = useCopy();
  return (
    <article className={`public-talent-card${compact ? " is-compact" : ""}`}>
      <header>
        <span>LK</span>
        <div>
          <strong>LAYAN KHALIL</strong>
          <small>PRODUCT · TECHNOLOGY</small>
        </div>
        <em>88%</em>
      </header>
      <p>
        {c(
          "أحوّل المشكلات المعقدة إلى تجارب واضحة مدعومة بالبحث والتجربة.",
          "I turn complex problems into clear experiences backed by research and experimentation.",
        )}
      </p>
      <div className="card-skill-list">
        {capabilities.slice(0, 4).map((skill) => (
          <span key={skill.key}>
            {c(skill.ar, skill.en)} <b>{skill.value}%</b>
          </span>
        ))}
      </div>
      <footer>
        <span>
          <ShieldCheck /> {c("إشارات موثقة", "Verified signals")}
        </span>
        <span>
          <Layers3 /> 3 {c("مشاريع", "projects")}
        </span>
      </footer>
    </article>
  );
}

export function CardBuilderPage({ status }: { status: Visibility }) {
  const c = useCopy();
  const [sections, setSections] = useState([true, true, true, false]);
  return (
    <DashboardShell title={c("منشئ البطاقة العامة", "Public card builder")}>
      <div className="card-builder-heading">
        <div>
          <span className={`status-pill status-pill--${status}`}>
            {c(visibilityCopy[status].ar, visibilityCopy[status].en)}
          </span>
          <h2>
            {c(
              "شارك قدراتك، بشروطك.",
              "Share your capabilities, on your terms.",
            )}
          </h2>
          <p>
            {c(
              "اختر ما يظهر للعامة. الأدلة الأصلية تبقى خاصة دائمًا.",
              "Choose what appears publicly. Original evidence always stays private.",
            )}
          </p>
        </div>
        {status === "live" && (
          <a className="secondary-button" href="#preview">
            <ExternalLink /> {c("فتح البطاقة", "Open card")}
          </a>
        )}
      </div>
      <div className="card-builder-layout">
        <section className="card-controls">
          <h3>{c("الأقسام الظاهرة", "Visible sections")}</h3>
          {[
            c("النبذة", "About"),
            c("أقوى القدرات", "Top capabilities"),
            c("المشاريع المختارة", "Selected projects"),
            c("درجة الاستعداد", "Readiness score"),
          ].map((label, index) => (
            <button
              type="button"
              key={label}
              onClick={() =>
                setSections((current) =>
                  current.map((value, itemIndex) =>
                    itemIndex === index ? !value : value,
                  ),
                )
              }
            >
              <span>
                <Eye size={17} />
                {label}
              </span>
              <i className={sections[index] ? "is-on" : ""}>
                <b />
              </i>
            </button>
          ))}
          <div className="privacy-note">
            <LockKeyhole />
            <p>
              {c(
                "لن نعرض ملفاتك أو روابط الأدلة الخاصة.",
                "Private files and evidence links are never shown.",
              )}
            </p>
          </div>
          <button className="primary-button" type="button">
            {status === "live"
              ? c("حفظ التحديثات", "Save changes")
              : c("نشر البطاقة", "Publish card")}
          </button>
          {status === "live" && (
            <button className="danger-button" type="button">
              {c("إيقاف النشر", "Revoke public access")}
            </button>
          )}
        </section>
        <div id="preview" className="card-preview">
          <span>{c("معاينة البطاقة", "Card preview")}</span>
          <PublicTalentCard />
        </div>
      </div>
    </DashboardShell>
  );
}

export function PublicCardPage({ status }: { status: "private" | "live" }) {
  const c = useCopy();
  return (
    <main className="public-card-page">
      <header>
        <img src={logo} width="150" height="50" alt="Talent DNA AI" />
        <LanguageToggle />
      </header>
      {status === "private" ? (
        <section className="public-state">
          <LockKeyhole />
          <h1>{c("هذه البطاقة خاصة.", "This card is private.")}</h1>
          <p>
            {c(
              "لم يشارك صاحب الملف بطاقة Talent DNA عامة بعد.",
              "The profile owner has not shared a public Talent DNA card.",
            )}
          </p>
          <Link className="primary-button" to="/">
            {c("اكتشف Talent DNA", "Discover Talent DNA")}
          </Link>
        </section>
      ) : (
        <section className="public-card-wrap">
          <PublicTalentCard />
          <div className="public-proof">
            <h2>{c("كيف تقرأ هذه البطاقة؟", "How to read this card")}</h2>
            <p>
              {c(
                "كل قدرة تحمل مستوى تحقق خاصًا بها، ولا تُعرض الأدلة الأصلية للعامة.",
                "Each capability has its own verification level; original evidence is never public.",
              )}
            </p>
            <div>
              <span>
                <UserRound /> {c("مصرّح بها", "Self-declared")}
              </span>
              <span>
                <BrainCircuit /> {c("مستنتجة", "AI-inferred")}
              </span>
              <span>
                <FileCheck2 /> {c("مدعومة بالدليل", "Evidence-supported")}
              </span>
            </div>
          </div>
        </section>
      )}
      <footer>© 2026 Talent DNA AI</footer>
    </main>
  );
}

export function PrivacyPage({ status }: { status: Visibility }) {
  const c = useCopy();
  const [visibility, setVisibility] = useState(status);
  const live = visibility === "live";
  return (
    <DashboardShell title={c("الخصوصية والمشاركة", "Privacy & sharing")}>
      <section className="privacy-hero">
        <div className={`privacy-icon privacy-icon--${visibility}`}>
          {live ? (
            <Eye />
          ) : visibility === "revoked" ? (
            <EyeOff />
          ) : (
            <LockKeyhole />
          )}
        </div>
        <div>
          <span className={`status-pill status-pill--${visibility}`}>
            {c(visibilityCopy[visibility].ar, visibilityCopy[visibility].en)}
          </span>
          <h2>
            {live
              ? c("بطاقتك مرئية للعامة.", "Your card is publicly visible.")
              : visibility === "revoked"
                ? c(
                    "تم إيقاف رابط البطاقة.",
                    "Your card link has been revoked.",
                  )
                : c(
                    "ملفك خاص افتراضيًا.",
                    "Your profile is private by default.",
                  )}
          </h2>
          <p>
            {c(
              "أنت تتحكم بما يظهر ومتى يتوقف الوصول إليه.",
              "You control what is visible and when access ends.",
            )}
          </p>
        </div>
      </section>
      <div className="privacy-grid">
        <section>
          <h3>{c("حالة المشاركة", "Sharing status")}</h3>
          <div className="privacy-row">
            <div>
              <Globe2 />
              <span>
                <strong>{c("البطاقة العامة", "Public card")}</strong>
                <small>
                  {live
                    ? "talentdna.ai/layan"
                    : c("لا يوجد رابط نشط", "No active link")}
                </small>
              </span>
            </div>
            <i className={live ? "is-on" : ""}>
              <b />
            </i>
          </div>
          <div className="privacy-row">
            <div>
              <FileCheck2 />
              <span>
                <strong>
                  {c("إظهار المشاريع المختارة", "Show selected projects")}
                </strong>
                <small>
                  {c(
                    "لا يتم عرض الأدلة الأصلية",
                    "Original evidence remains hidden",
                  )}
                </small>
              </span>
            </div>
            <i className={live ? "is-on" : ""}>
              <b />
            </i>
          </div>
          <div className="privacy-row">
            <div>
              <BarChart3 />
              <span>
                <strong>
                  {c("إظهار درجة الاستعداد", "Show readiness score")}
                </strong>
                <small>
                  {c(
                    "اختياري ويمكن تغييره لاحقًا",
                    "Optional and editable anytime",
                  )}
                </small>
              </span>
            </div>
            <i>
              <b />
            </i>
          </div>
        </section>
        <aside>
          <ShieldCheck />
          <h3>{c("ما يبقى خاصًا دائمًا", "What always stays private")}</h3>
          <ul>
            <li>{c("ملفات الأدلة الأصلية", "Original evidence files")}</li>
            <li>{c("إجابات التقييم", "Assessment answers")}</li>
            <li>{c("البريد وبيانات الحساب", "Email and account details")}</li>
            <li>{c("إشارات غير مؤكدة", "Unconfirmed signals")}</li>
          </ul>
        </aside>
      </div>
      <div className="privacy-actions">
        {live ? (
          <button
            className="danger-button"
            type="button"
            onClick={() => setVisibility("revoked")}
          >
            {c("إيقاف الرابط العام", "Revoke public link")}
          </button>
        ) : (
          <button
            className="primary-button"
            type="button"
            onClick={() => setVisibility("live")}
          >
            {c("نشر بطاقة عامة", "Publish public card")}
          </button>
        )}
        <Link className="secondary-button" to="/card-builder/private">
          {c("تخصيص البطاقة", "Customize card")}
        </Link>
      </div>
    </DashboardShell>
  );
}
