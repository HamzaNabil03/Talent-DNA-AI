import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "../shared/i18n/config";
import { App } from "./App";

const anonymous = {
  authenticated: false,
  user: null,
  email_verified: false,
  consents: { terms: false, privacy: false, ai_processing: false },
  next_step: null,
};
const unverified = {
  authenticated: true,
  user: {
    id: 1,
    name: "Student",
    email: "student@example.com",
    role: "student",
  },
  email_verified: false,
  consents: { terms: true, privacy: true, ai_processing: false },
  next_step: "verify_email",
};
const consentNeeded = {
  ...unverified,
  email_verified: true,
  next_step: "consent",
};
const complete = {
  ...consentNeeded,
  consents: { ...consentNeeded.consents, ai_processing: true },
  next_step: "profile_setup",
};

function response(body: unknown, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

describe("identity, authentication, and consent onboarding", () => {
  beforeEach(async () => {
    localStorage.clear();
    await i18n.changeLanguage("ar");
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    window.history.pushState({}, "", "/auth/sign-in");
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the public Arabic landing page with the supplied DNA asset", async () => {
    window.history.pushState({}, "", "/");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(anonymous)));
    const { container } = render(<App />);
    expect(
      await screen.findByRole("heading", { name: /قدراتك، أصبحت مرئية/ }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "اكتشف قدراتي" })[0],
    ).toHaveAttribute("href", "/auth/sign-up");
    expect(
      container.querySelector(".landing-hero__visual img"),
    ).toHaveAttribute("src", expect.stringContaining("landing-dna.svg"));
    expect(document.title).toBe("Talent DNA AI — اكتشف قدراتك الحقيقية");
  });

  it("keeps the landing page while switching to English LTR", async () => {
    window.history.pushState({}, "", "/");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(anonymous)));
    render(<App />);
    await userEvent.click(
      await screen.findByRole("button", { name: "English" }),
    );
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
    expect(
      await screen.findByRole("heading", {
        name: /Your capabilities. Made visible/,
      }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
  });

  it("renders sign-up without social login and toggles RTL/LTR", async () => {
    window.history.pushState({}, "", "/auth/sign-up");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(anonymous)));
    render(<App />);
    expect(
      await screen.findByRole("heading", {
        name: "ابدأ بناء Talent DNA الخاص بك.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("الاسم الكامل")).toBeInTheDocument();
    expect(screen.queryByText(/Google|Apple/)).not.toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    await userEvent.click(
      screen.getByRole("button", { name: "التبديل إلى الإنجليزية" }),
    );
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
    expect(
      await screen.findByRole("heading", {
        name: "Start building your Talent DNA.",
      }),
    ).toBeInTheDocument();
  });

  it("validates sign-up, opens legal dialogs, and advances to verification", async () => {
    window.history.pushState({}, "", "/auth/sign-up");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(anonymous))
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response(unverified, 201));
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    await userEvent.click(
      await screen.findByRole("button", { name: "شروط الخدمة" }),
    );
    expect(screen.getByRole("dialog")).toHaveTextContent("terms-v1");
    await userEvent.click(screen.getAllByRole("button", { name: "إغلاق" })[0]!);
    await userEvent.click(
      screen.getByRole("button", { name: "أنشئ Talent DNA الخاص بي" }),
    );
    expect(
      await screen.findByText("يجب أن تتكون كلمة المرور من 10 أحرف على الأقل."),
    ).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("الاسم الكامل"), "Student");
    await userEvent.type(
      screen.getByLabelText("البريد الإلكتروني"),
      "student@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("كلمة المرور"),
      "secure-password",
    );
    await userEvent.type(
      screen.getByLabelText("تأكيد كلمة المرور"),
      "secure-password",
    );
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(
      screen.getByRole("button", { name: "أنشئ Talent DNA الخاص بي" }),
    );
    expect(
      await screen.findByRole("heading", { name: "تحقق من بريدك الإلكتروني" }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/sanctum/csrf-cookie",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("signs in with email and password only and focuses generic failures", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(anonymous))
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(
        response({ detail: "بيانات الدخول غير صحيحة." }, 422),
      );
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    expect(
      await screen.findByRole("heading", {
        name: "مرحبًا بعودتك إلى Talent DNA.",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("الاسم الكامل")).not.toBeInTheDocument();
    await userEvent.type(
      screen.getByLabelText("البريد الإلكتروني"),
      "student@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("كلمة المرور"),
      "wrong-password",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "تسجيل الدخول إلى Talent DNA" }),
    );
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveFocus();
    expect(alert).toHaveTextContent("بيانات الدخول غير صحيحة.");
  });

  it("handles verification resend and logout states", async () => {
    window.history.pushState({}, "", "/auth/verify-email");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(unverified))
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({ status: "verification_link_sent" }))
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce({ ok: true, status: 204, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    await userEvent.click(
      await screen.findByRole("button", { name: "إعادة إرسال رابط التفعيل" }),
    );
    expect(
      await screen.findByText("أُرسل رابط تفعيل جديد."),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "تسجيل الخروج" }));
    expect(
      await screen.findByRole("heading", {
        name: "مرحبًا بعودتك إلى Talent DNA.",
      }),
    ).toBeInTheDocument();
  });

  it("shows verification outcomes safely without creating a session", async () => {
    window.history.pushState({}, "", "/auth/verify-email?status=expired");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(anonymous)));
    render(<App />);
    expect(
      await screen.findByText("انتهت صلاحية رابط التفعيل. اطلب رابطًا جديدًا."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "الانتقال إلى تسجيل الدخول" }),
    ).toHaveAttribute("href", "/auth/sign-in");
    expect(
      screen.queryByRole("button", { name: "إعادة إرسال رابط التفعيل" }),
    ).not.toBeInTheDocument();
  });

  it("returns the same forgot-password success state", async () => {
    window.history.pushState({}, "", "/auth/forgot-password");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response(anonymous))
        .mockResolvedValueOnce(response({}))
        .mockResolvedValueOnce(response({ status: "reset_link_processed" })),
    );
    render(<App />);
    await userEvent.type(
      await screen.findByLabelText("البريد الإلكتروني"),
      "unknown@example.com",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "إرسال تعليمات إعادة التعيين" }),
    );
    expect(
      await screen.findByText(
        "إذا كان البريد مرتبطًا بحساب، فقد أرسلنا تعليمات إعادة التعيين.",
      ),
    ).toBeInTheDocument();
  });

  it("resets a password and reports success", async () => {
    window.history.pushState(
      {},
      "",
      "/auth/reset-password?token=signed-token&email=student%40example.com",
    );
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response(anonymous))
        .mockResolvedValueOnce(response({}))
        .mockResolvedValueOnce(response({ status: "password_reset" })),
    );
    render(<App />);
    await userEvent.type(
      await screen.findByLabelText("كلمة المرور"),
      "new-secure-password",
    );
    await userEvent.type(
      screen.getByLabelText("تأكيد كلمة المرور"),
      "new-secure-password",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "حفظ كلمة المرور الجديدة" }),
    );
    expect(
      await screen.findByText("تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن."),
    ).toBeInTheDocument();
  });

  it("guards protected routes for anonymous users", async () => {
    window.history.pushState({}, "", "/onboarding/consent");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(anonymous)));
    render(<App />);
    expect(
      await screen.findByRole("heading", {
        name: "مرحبًا بعودتك إلى Talent DNA.",
      }),
    ).toBeInTheDocument();
  });

  it("keeps consent explicit and advances only after acceptance", async () => {
    window.history.pushState({}, "", "/onboarding/consent");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(consentNeeded))
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response(complete));
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    const submit = await screen.findByRole("button", {
      name: "المتابعة إلى ملفي الشخصي",
    });
    expect(submit).toBeDisabled();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(submit).toBeEnabled();
    await userEvent.click(submit);
    expect(
      await screen.findByRole("heading", { name: "اكتملت بوابة الموافقة" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
  });
});
