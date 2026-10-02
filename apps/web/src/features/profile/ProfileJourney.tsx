/* oxlint-disable react/set-state-in-effect -- route loads synchronize local form state with the authenticated API */
import {
  Check,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Layers3,
  Link2,
  LoaderCircle,
  Plus,
  Save,
  ShieldCheck,
  Target,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../../shared/api/auth";
import {
  profileApi,
  type DirectionInput,
  type Evidence,
  type EvidenceLimits,
  type Profile,
  type Project,
  type ProjectInput,
  type VisionInput,
} from "../../shared/api/profile";
import { useSession } from "../../shared/auth/SessionContext";
import { ProductHeader } from "../experience/ProductExperience";

type Copy = (ar: string, en: string) => string;
type Step = 1 | 2 | 3 | 4;

const steps = [
  { ar: "الاتجاه", en: "Direction", href: "/builder/direction" },
  { ar: "المشاريع والخبرة", en: "Projects", href: "/builder/projects" },
  { ar: "الأدلة", en: "Evidence", href: "/builder/evidence" },
  { ar: "رؤيتك", en: "Your view", href: "/builder/vision" },
];

function useCopy(): Copy {
  const { i18n } = useTranslation();
  return (ar, en) => (i18n.language === "en" ? en : ar);
}

function errorMessage(error: unknown, c: Copy): string {
  if (error instanceof ApiError) return error.message;
  return c(
    "تعذر إكمال الطلب. حاول مرة أخرى.",
    "The request could not be completed. Try again.",
  );
}

function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}

function Loading({ onRetry }: { onRetry?: () => void }) {
  const c = useCopy();
  return (
    <main className="route-state" role="status">
      <LoaderCircle className="spin" />{" "}
      {c("جارٍ تحميل بياناتك…", "Loading your data…")}
      {onRetry && (
        <button type="button" onClick={onRetry}>
          {c("إعادة المحاولة", "Retry")}
        </button>
      )}
    </main>
  );
}

function SaveState({
  state,
}: {
  state: "idle" | "dirty" | "saving" | "saved" | "error";
}) {
  const c = useCopy();
  const labels = {
    idle: c("بياناتك خاصة", "Your data is private"),
    dirty: c("تغييرات غير محفوظة", "Unsaved changes"),
    saving: c("جارٍ الحفظ…", "Saving…"),
    saved: c("تم الحفظ", "Saved"),
    error: c("لم يتم الحفظ", "Not saved"),
  };
  return (
    <span className={`save-state save-state--${state}`} role="status">
      {state === "saving" ? (
        <LoaderCircle className="spin" size={14} />
      ) : (
        <Save size={14} />
      )}
      {labels[state]}
    </span>
  );
}

function Progress({ current }: { current: Step }) {
  const c = useCopy();
  return (
    <section
      className="builder-progress"
      aria-label={c("تقدم بناء الملف", "Profile progress")}
    >
      <strong>{c("منشئ الملف الشخصي", "Profile builder")}</strong>
      <span>{c(`الخطوة ${current} من 4`, `Step ${current} of 4`)}</span>
      <ol>
        {steps.map((step, index) => (
          <li
            key={step.href}
            className={index + 1 <= current ? "is-active" : ""}
          >
            <Link
              to={step.href}
              aria-current={index + 1 === current ? "step" : undefined}
            >
              <i>{index + 1 < current ? <Check size={15} /> : index + 1}</i>
              <span>{c(step.ar, step.en)}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  textarea,
  type = "text",
  children,
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  textarea?: boolean;
  type?: string;
  children?: ReactNode;
}) {
  return (
    <label className="builder-field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {children ??
        (textarea ? (
          <textarea
            value={value ?? ""}
            onChange={(event) => onChange?.(event.target.value)}
            rows={4}
          />
        ) : (
          <input
            type={type}
            value={value ?? ""}
            onChange={(event) => onChange?.(event.target.value)}
          />
        ))}
    </label>
  );
}

function Shell({
  step,
  dirty,
  state,
  children,
}: {
  step: Step;
  dirty: boolean;
  state: Parameters<typeof SaveState>[0]["state"];
  children: ReactNode;
}) {
  const c = useCopy();
  const navigate = useNavigate();
  useUnsavedWarning(dirty);
  const confirmLeave = () =>
    !dirty ||
    window.confirm(
      c(
        "لديك تغييرات غير محفوظة. هل تريد المغادرة؟",
        "You have unsaved changes. Leave anyway?",
      ),
    );
  const captureLinks = (event: MouseEvent<HTMLElement>) => {
    if (
      !dirty ||
      !(event.target instanceof Element) ||
      !event.target.closest("a") ||
      confirmLeave()
    )
      return;
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <main className="product-page builder-page" onClickCapture={captureLinks}>
      <ProductHeader
        section={c("بناء الملف", "Profile builder")}
        onBack={() => {
          if (confirmLeave()) navigate(-1);
        }}
      />
      <Progress current={step} />
      <section className="builder-card profile-journey-card">
        <aside className="builder-aside profile-journey-aside">
          <ShieldCheck size={52} />
          <h2>{c("بياناتك محفوظة بشكل خاص", "Your input stays private")}</h2>
          <p>
            {c(
              "الوصف الذاتي يمنح سياقًا فقط، ولا يثبت المهارة أو ينشئ نتيجة تحليل.",
              "Self-description provides context only. It does not prove a skill or create an analysis result.",
            )}
          </p>
        </aside>
        <div className="builder-content">
          <div className="builder-content__meta">
            <SaveState state={state} />
            <b>{c(steps[step - 1].ar, steps[step - 1].en)}</b>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}

function DirectionStep({ profile }: { profile: Profile }) {
  const c = useCopy();
  const navigate = useNavigate();
  const [form, setForm] = useState<DirectionInput>({
    field: profile.field,
    current_stage: profile.current_stage,
    career_direction: profile.career_direction,
    professional_interest: profile.professional_interest,
  });
  const [dirty, setDirty] = useState(false);
  const [state, setState] =
    useState<Parameters<typeof SaveState>[0]["state"]>("idle");
  const [error, setError] = useState("");
  const update = (key: keyof DirectionInput, value: string | null) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setState("dirty");
  };
  const save = async (next: boolean) => {
    setState("saving");
    setError("");
    try {
      await profileApi.saveDirection(form);
      setDirty(false);
      setState("saved");
      if (next) navigate("/builder/projects");
    } catch (requestError) {
      setState("error");
      setError(errorMessage(requestError, c));
    }
  };
  return (
    <Shell step={1} dirty={dirty} state={state}>
      <h1>
        {c("اختر مجالك وحدد اتجاهك.", "Choose your field and direction.")}
      </h1>
      <p className="builder-lead">
        {c(
          "يمكنك حفظ مسودة والعودة لاحقًا.",
          "You can save a partial draft and return later.",
        )}
      </p>
      <div className="builder-form-card builder-form-grid">
        <Field label={c("الاسم الكامل", "Full name")} value={profile.name}>
          <input value={profile.name} disabled />
        </Field>
        <Field label={c("المجال", "Field")} required>
          <select
            value={form.field ?? ""}
            onChange={(event) => update("field", event.target.value || null)}
          >
            <option value="">{c("اختر المجال", "Choose a field")}</option>
            <option value="web">{c("الويب", "Web")}</option>
            <option value="english">{c("الإنجليزي", "English")}</option>
            <option value="marketing">{c("التسويق", "Marketing")}</option>
            <option value="business_administration">
              {c("إدارة الأعمال", "Business administration")}
            </option>
          </select>
        </Field>
        <Field
          label={c("المرحلة الحالية", "Current stage")}
          value={form.current_stage ?? ""}
          onChange={(value) => update("current_stage", value || null)}
        />
        <Field
          label={c("الاتجاه المهني", "Career direction")}
          value={form.career_direction ?? ""}
          onChange={(value) => update("career_direction", value || null)}
          required
        />
        <Field
          label={c("الاهتمام المهني", "Professional interest")}
          value={form.professional_interest ?? ""}
          onChange={(value) => update("professional_interest", value || null)}
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Actions
        onSave={() => void save(false)}
        onNext={() => void save(true)}
        busy={state === "saving"}
        c={c}
      />
    </Shell>
  );
}

const emptyProject: ProjectInput = {
  title: "",
  description: null,
  contribution: null,
  role: null,
  tools: [],
  outcome: null,
  project_date: null,
  is_team: false,
};

function ProjectStep({
  projects,
  reload,
}: {
  projects: Project[];
  reload: () => Promise<void>;
}) {
  const c = useCopy();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectInput>(emptyProject);
  const [tools, setTools] = useState("");
  const [dirty, setDirty] = useState(false);
  const [state, setState] =
    useState<Parameters<typeof SaveState>[0]["state"]>("idle");
  const [error, setError] = useState("");
  const update = <K extends keyof ProjectInput>(
    key: K,
    value: ProjectInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setState("dirty");
  };
  const reset = () => {
    setEditingId(null);
    setForm(emptyProject);
    setTools("");
    setDirty(false);
    setState("idle");
  };
  const edit = (project: Project) => {
    setEditingId(project.id);
    setForm(project);
    setTools((project.tools ?? []).join(", "));
    setDirty(false);
    setState("idle");
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setState("saving");
    setError("");
    const body = {
      ...form,
      tools: tools
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) await profileApi.updateProject(editingId, body);
      else await profileApi.createProject(body);
      await reload();
      reset();
      setState("saved");
    } catch (requestError) {
      setState("error");
      setError(errorMessage(requestError, c));
    }
  };
  const remove = async (project: Project) => {
    const warning =
      project.evidence_count > 0
        ? c(
            `هذا المشروع مرتبط بـ ${project.evidence_count} دليل. انقل الأدلة أو احذفها أولًا.`,
            `This project has ${project.evidence_count} linked evidence item(s). Reassign or delete them first.`,
          )
        : c(
            "هل تريد حذف هذا المشروع؟ لن تُحذف أي أدلة بصمت.",
            "Delete this project? Evidence is never removed silently.",
          );
    if (!window.confirm(warning) || project.evidence_count > 0) return;
    try {
      await profileApi.deleteProject(project.id);
      await reload();
    } catch (requestError) {
      setError(errorMessage(requestError, c));
    }
  };
  return (
    <Shell step={2} dirty={dirty} state={state}>
      <h1>{c("أضف مشروعًا حقيقيًا.", "Add a real project.")}</h1>
      <p className="builder-lead">
        {c(
          "في العمل الجماعي يجب توضيح دورك. يمكنك تعديل كل مشروع أو حذفه.",
          "For team work, your role is required. Every project can be edited or deleted.",
        )}
      </p>
      <div className="journey-records">
        {projects.map((project) => (
          <article key={project.id}>
            <Layers3 />
            <div>
              <strong>{project.title}</strong>
              <small>
                {project.is_team
                  ? c("مشروع جماعي", "Team project")
                  : c("مشروع فردي", "Individual project")}{" "}
                · {project.evidence_count} {c("دليل", "evidence")}
              </small>
            </div>
            <button type="button" onClick={() => edit(project)}>
              {c("تعديل", "Edit")}
            </button>
            <button
              type="button"
              onClick={() => void remove(project)}
              aria-label={c("حذف المشروع", "Delete project")}
            >
              <Trash2 size={16} />
            </button>
          </article>
        ))}
      </div>
      <form className="builder-form-card builder-form-grid" onSubmit={submit}>
        <Field
          label={c("عنوان المشروع", "Project title")}
          value={form.title}
          onChange={(value) => update("title", value)}
          required
        />
        <Field
          label={c("التاريخ", "Date")}
          type="date"
          value={form.project_date ?? ""}
          onChange={(value) => update("project_date", value || null)}
        />
        <Field
          label={c("الوصف", "Description")}
          textarea
          value={form.description ?? ""}
          onChange={(value) => update("description", value || null)}
        />
        <Field
          label={c("مساهمتك", "Your contribution")}
          textarea
          value={form.contribution ?? ""}
          onChange={(value) => update("contribution", value || null)}
        />
        <label className="builder-check">
          <input
            type="checkbox"
            checked={form.is_team}
            onChange={(event) => update("is_team", event.target.checked)}
          />{" "}
          {c("هذا مشروع جماعي", "This is a team project")}
        </label>
        <Field
          label={c("دورك", "Your role")}
          value={form.role ?? ""}
          onChange={(value) => update("role", value || null)}
          required={form.is_team}
        />
        <Field
          label={c("الأدوات (افصل بفاصلة)", "Tools (comma-separated)")}
          value={tools}
          onChange={(value) => {
            setTools(value);
            setDirty(true);
            setState("dirty");
          }}
        />
        <Field
          label={c("النتيجة أو الأثر", "Outcome or impact")}
          textarea
          value={form.outcome ?? ""}
          onChange={(value) => update("outcome", value || null)}
        />
        <button
          className="primary-button"
          type="submit"
          disabled={state === "saving"}
        >
          <Plus size={17} />{" "}
          {editingId
            ? c("حفظ التعديل", "Save changes")
            : c("إضافة المشروع", "Add project")}
        </button>
        {editingId && (
          <button className="secondary-button" type="button" onClick={reset}>
            {c("إلغاء", "Cancel")}
          </button>
        )}
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="builder-actions">
        <button
          className="primary-button"
          type="button"
          disabled={projects.length === 0}
          onClick={() => navigate("/builder/evidence")}
        >
          {c("متابعة إلى الأدلة", "Continue to evidence")}
        </button>
        <Link className="secondary-button" to="/builder/direction">
          {c("رجوع", "Back")}
        </Link>
      </div>
    </Shell>
  );
}

function EvidenceStep({
  projects,
  evidence,
  limits,
  reload,
}: {
  projects: Project[];
  evidence: Evidence[];
  limits: EvidenceLimits;
  reload: () => Promise<void>;
}) {
  const c = useCopy();
  const navigate = useNavigate();
  const [type, setType] = useState<"file" | "link">("file");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [context, setContext] = useState("");
  const [projectId, setProjectId] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dirty, setDirty] = useState(false);
  const [state, setState] =
    useState<Parameters<typeof SaveState>[0]["state"]>("idle");
  const [error, setError] = useState("");
  const change = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setDirty(true);
    setState("dirty");
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setState("saving");
    setError("");
    const body = new FormData();
    body.set("type", type);
    body.set("title", title);
    body.set("description", description);
    body.set("context", context);
    if (projectId) body.set("project_id", projectId);
    if (type === "link") body.set("link_url", linkUrl);
    else if (file) body.set("file", file);
    try {
      await profileApi.createEvidence(body);
      await reload();
      setTitle("");
      setDescription("");
      setContext("");
      setLinkUrl("");
      setFile(null);
      setDirty(false);
      setState("saved");
    } catch (requestError) {
      setState("error");
      setError(errorMessage(requestError, c));
    }
  };
  const remove = async (item: Evidence) => {
    if (
      !window.confirm(
        c("حذف هذا الدليل نهائيًا؟", "Delete this evidence item permanently?"),
      )
    )
      return;
    try {
      await profileApi.deleteEvidence(item.id);
      await reload();
    } catch (requestError) {
      setError(errorMessage(requestError, c));
    }
  };
  const relink = async (item: Evidence, selectedProjectId: string) => {
    setError("");
    try {
      await profileApi.updateEvidence(item.id, {
        project_id: selectedProjectId ? Number(selectedProjectId) : null,
      });
      await reload();
    } catch (requestError) {
      setError(errorMessage(requestError, c));
    }
  };
  const replace = async (item: Evidence, replacement: File | null) => {
    if (!replacement) return;
    setError("");
    try {
      await profileApi.replaceEvidenceFile(item.id, replacement);
      await reload();
    } catch (requestError) {
      setError(errorMessage(requestError, c));
    }
  };
  return (
    <Shell step={3} dirty={dirty} state={state}>
      <h1>{c("أضف دليلًا خاصًا.", "Add private evidence.")}</h1>
      <p className="builder-lead">
        {c(
          `حد تطوير مؤقت: ${limits.max_items} عنصر، وحجم ${Math.round(limits.max_file_size_kb / 1024)}MB للملف. الرابط يُحفظ ولا يُقرأ تلقائيًا.`,
          `Temporary development limit: ${limits.max_items} items and ${Math.round(limits.max_file_size_kb / 1024)}MB per file. Links are saved but never fetched automatically.`,
        )}
      </p>
      <div className="evidence-list journey-records">
        {evidence.map((item) => (
          <article key={item.id}>
            <FileCheck2 />
            <div>
              <strong>{item.title}</strong>
              <small>
                {item.type === "file"
                  ? c(
                      "تم الرفع والتحقق من النوع والحجم · لم يُقرأ · لم يُحلل",
                      "Uploaded and type/size validated · Not read · Not analyzed",
                    )
                  : c(
                      "رابط محفوظ · لم يُقرأ · لم يُحلل",
                      "Link saved · Not read · Not analyzed",
                    )}
              </small>
              <select
                aria-label={c(
                  `المشروع المرتبط بـ ${item.title}`,
                  `Project linked to ${item.title}`,
                )}
                value={item.project_id ?? ""}
                onChange={(event) => void relink(item, event.target.value)}
              >
                <option value="">{c("بدون مشروع", "No project")}</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
            {item.download_url && (
              <a href={item.download_url}>
                <Download size={16} /> {c("تنزيل", "Download")}
              </a>
            )}
            {item.type === "file" && (
              <label className="evidence-replace">
                {c("استبدال", "Replace")}
                <input
                  type="file"
                  hidden
                  accept={limits.allowed_extensions
                    .map((extension) => `.${extension}`)
                    .join(",")}
                  onChange={(event) =>
                    void replace(item, event.target.files?.[0] ?? null)
                  }
                />
              </label>
            )}
            <button
              type="button"
              onClick={() => void remove(item)}
              aria-label={c("حذف الدليل", "Delete evidence")}
            >
              <Trash2 size={16} />
            </button>
          </article>
        ))}
      </div>
      <form
        className="builder-form-card evidence-upload-form"
        onSubmit={submit}
      >
        <div className="evidence-kind">
          <button
            type="button"
            className={type === "file" ? "is-selected" : ""}
            onClick={() => {
              setType("file");
              setDirty(true);
            }}
          >
            <UploadCloud /> {c("ملف", "File")}
          </button>
          <button
            type="button"
            className={type === "link" ? "is-selected" : ""}
            onClick={() => {
              setType("link");
              setDirty(true);
            }}
          >
            <Link2 /> {c("رابط", "Link")}
          </button>
        </div>
        <div className="builder-form-grid">
          <Field
            label={c("عنوان الدليل", "Evidence title")}
            value={title}
            onChange={change(setTitle)}
            required
          />
          <Field label={c("المشروع المرتبط", "Linked project")}>
            <select
              value={projectId}
              onChange={(event) => {
                setProjectId(event.target.value);
                setDirty(true);
              }}
            >
              <option value="">{c("بدون مشروع", "No project")}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={c("الوصف", "Description")}
            textarea
            value={description}
            onChange={change(setDescription)}
          />
          <Field
            label={c("السياق ودورك", "Context and your role")}
            textarea
            value={context}
            onChange={change(setContext)}
          />
          {type === "file" ? (
            <Field label={c("الملف", "File")} required>
              <input
                type="file"
                accept={limits.allowed_extensions
                  .map((extension) => `.${extension}`)
                  .join(",")}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setFile(event.target.files?.[0] ?? null);
                  setDirty(true);
                  setState("dirty");
                }}
              />
            </Field>
          ) : (
            <Field
              label={c("الرابط", "Link")}
              type="url"
              value={linkUrl}
              onChange={change(setLinkUrl)}
              required
            />
          )}
        </div>
        <button
          className="primary-button"
          type="submit"
          disabled={state === "saving"}
        >
          <Plus /> {c("إضافة الدليل", "Add evidence")}
        </button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="builder-actions">
        <button
          className="primary-button"
          type="button"
          disabled={evidence.length === 0}
          onClick={() => navigate("/builder/vision")}
        >
          {c("متابعة إلى رؤيتك", "Continue to your view")}
        </button>
        <Link className="secondary-button" to="/builder/projects">
          {c("رجوع", "Back")}
        </Link>
      </div>
    </Shell>
  );
}

function VisionStep({ profile }: { profile: Profile }) {
  const c = useCopy();
  const navigate = useNavigate();
  const { refresh } = useSession();
  const choices = [
    { id: "problem_solving", label: c("حل المشكلات", "Problem solving") },
    { id: "communication", label: c("التواصل", "Communication") },
    {
      id: "creative_thinking",
      label: c("التفكير الإبداعي", "Creative thinking"),
    },
    { id: "fast_learning", label: c("التعلم السريع", "Fast learning") },
    { id: "teamwork", label: c("العمل الجماعي", "Teamwork") },
    { id: "leadership", label: c("القيادة", "Leadership") },
  ];
  const [form, setForm] = useState<VisionInput>({
    vision: profile.vision,
    strengths: profile.strengths,
  });
  const [dirty, setDirty] = useState(false);
  const [state, setState] =
    useState<Parameters<typeof SaveState>[0]["state"]>("idle");
  const [error, setError] = useState("");
  const toggle = (strength: string) => {
    const current = form.strengths ?? [];
    setForm({
      ...form,
      strengths: current.includes(strength)
        ? current.filter((item) => item !== strength)
        : [...current, strength],
    });
    setDirty(true);
    setState("dirty");
  };
  const save = async (complete: boolean) => {
    setState("saving");
    setError("");
    try {
      await profileApi.saveVision(form);
      setDirty(false);
      if (complete) {
        await profileApi.complete();
        await refresh();
        navigate("/review");
      } else setState("saved");
    } catch (requestError) {
      setState("error");
      setError(errorMessage(requestError, c));
    }
  };
  return (
    <Shell step={4} dirty={dirty} state={state}>
      <h1>
        {c("أضف رؤيتك كسياق شخصي.", "Add your view as personal context.")}
      </h1>
      <p className="builder-lead">
        {c(
          "اختياراتك لا تُعد إثباتًا للمهارة، ولن تُنشئ نتيجة AI.",
          "Your selections are not skill evidence and will not create an AI result.",
        )}
      </p>
      <div className="builder-form-card vision-form">
        <div className="choice-grid">
          {choices.map((choice) => (
            <button
              type="button"
              className={
                (form.strengths ?? []).includes(choice.id) ? "is-selected" : ""
              }
              key={choice.id}
              onClick={() => toggle(choice.id)}
            >
              <CheckCircle2 />
              {choice.label}
            </button>
          ))}
        </div>
        <Field
          label={c("كيف تريد أن تنمو؟", "How do you want to grow?")}
          textarea
          value={form.vision ?? ""}
          onChange={(value) => {
            setForm({ ...form, vision: value || null });
            setDirty(true);
            setState("dirty");
          }}
          required
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Actions
        onSave={() => void save(false)}
        onNext={() => void save(true)}
        busy={state === "saving"}
        c={c}
        nextLabel={c("حفظ وإنهاء الإدخال", "Save and complete input")}
      />
    </Shell>
  );
}

function Actions({
  onSave,
  onNext,
  busy,
  c,
  nextLabel,
}: {
  onSave: () => void;
  onNext: () => void;
  busy: boolean;
  c: Copy;
  nextLabel?: string;
}) {
  return (
    <div className="builder-actions">
      <button
        className="primary-button"
        type="button"
        onClick={onNext}
        disabled={busy}
      >
        {nextLabel ?? c("حفظ ومتابعة", "Save and continue")}
      </button>
      <button
        className="secondary-button"
        type="button"
        onClick={onSave}
        disabled={busy}
      >
        {c("حفظ مسودة", "Save draft")}
      </button>
    </div>
  );
}

export function ProfileBuilderPage({ step }: { step: Step }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [limits, setLimits] = useState<EvidenceLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const load = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const [profileResponse, projectsResponse, evidenceResponse] =
        await Promise.all([
          profileApi.getProfile(),
          profileApi.projects(),
          profileApi.evidence(),
        ]);
      setProfile(profileResponse.data);
      setProjects(projectsResponse.data);
      setEvidence(evidenceResponse.data);
      setLimits(evidenceResponse.limits);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  if (loading) return <Loading />;
  if (failed || !profile || !limits)
    return <Loading onRetry={() => void load()} />;
  if (step === 1) return <DirectionStep profile={profile} />;
  if (step === 2) return <ProjectStep projects={projects} reload={load} />;
  if (step === 3)
    return (
      <EvidenceStep
        projects={projects}
        evidence={evidence}
        limits={limits}
        reload={load}
      />
    );
  return <VisionStep profile={profile} />;
}

export function ProfileReviewPage() {
  const c = useCopy();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [failed, setFailed] = useState(false);
  const load = async () => {
    setFailed(false);
    try {
      const [p, projectsResponse, evidenceResponse] = await Promise.all([
        profileApi.getProfile(),
        profileApi.projects(),
        profileApi.evidence(),
      ]);
      setProfile(p.data);
      setProjects(projectsResponse.data);
      setEvidence(evidenceResponse.data);
    } catch {
      setFailed(true);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  if (!profile)
    return <Loading onRetry={failed ? () => void load() : undefined} />;
  return (
    <main className="product-page">
      <ProductHeader section={c("مراجعة الملف", "Profile review")} />
      <section className="review-shell">
        <div className="review-heading">
          <span>
            <ShieldCheck /> {c("بيانات إدخال محفوظة", "Saved profile input")}
          </span>
          <h1>{c("راجع بياناتك الحقيقية.", "Review your real data.")}</h1>
          <p>
            {c(
              "التحليل غير متاح في هذه المرحلة، ولم تُنشأ بصمة أو درجات أو مهارات.",
              "Analysis is not available in this stage. No DNA snapshot, scores, or skills have been generated.",
            )}
          </p>
        </div>
        <div className="review-grid">
          <ReviewCard
            icon={Target}
            title={c("الاتجاه", "Direction")}
            value={profile.career_direction || c("غير مضاف", "Not added")}
            to="/builder/direction"
            c={c}
          />
          <ReviewCard
            icon={Layers3}
            title={c("المشاريع", "Projects")}
            value={`${projects.length} ${c("مشروع", "project(s)")}`}
            to="/builder/projects"
            c={c}
          />
          <ReviewCard
            icon={FileCheck2}
            title={c("الأدلة الخاصة", "Private evidence")}
            value={`${evidence.length} ${c("دليل", "item(s)")}`}
            to="/builder/evidence"
            c={c}
          />
          <ReviewCard
            icon={FileText}
            title={c("رؤيتك", "Your view")}
            value={profile.vision || c("غير مضافة", "Not added")}
            to="/builder/vision"
            c={c}
          />
        </div>
        <div className="review-record-list">
          <h2>{c("المشاريع المحفوظة", "Saved projects")}</h2>
          {projects.map((project) => (
            <article key={project.id}>
              <strong>{project.title}</strong>
              <span>{project.role || c("دور غير محدد", "No role added")}</span>
            </article>
          ))}
          <h2>{c("الأدلة المحفوظة", "Saved evidence")}</h2>
          {evidence.map((item) => (
            <article key={item.id}>
              <strong>{item.title}</strong>
              <span>
                {item.type === "file"
                  ? c(
                      "خاص · لم يُقرأ · لم يُحلل",
                      "Private · Not read · Not analyzed",
                    )
                  : c(
                      "رابط غير مقروء · لم يُحلل",
                      "Unread link · Not analyzed",
                    )}
              </span>
            </article>
          ))}
        </div>
        <div className="review-consent">
          <ShieldCheck />
          <div>
            <strong>
              {c("اكتملت بيانات الإدخال فقط", "Profile input is complete")}
            </strong>
            <p>
              {c(
                "لن يبدأ Gemini إلا بطلبك. راجع سياسة الخصوصية قبل إرسال أدلتك الخاصة للتحليل.",
                "Gemini starts only when you ask. Review the privacy notice before sending private evidence for analysis.",
              )}
            </p>
            <Link className="primary-button" to="/analysis">
              {c("متابعة إلى تحليل الأدلة", "Continue to evidence analysis")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ReviewCard({
  icon: Icon,
  title,
  value,
  to,
  c,
}: {
  icon: typeof Target;
  title: string;
  value: string;
  to: string;
  c: Copy;
}) {
  return (
    <article>
      <div className="review-icon">
        <Icon />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{value}</p>
      </div>
      <Link to={to}>{c("تعديل", "Edit")}</Link>
    </article>
  );
}
