import i18n from "i18next";
import { initReactI18next } from "react-i18next";

void i18n.use(initReactI18next).init({
  lng:
    typeof localStorage === "undefined"
      ? "ar"
      : (localStorage.getItem("talent-dna-language") ?? "ar"),
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
  resources: {
    ar: {
      translation: {
        common: {
          loading: "جارٍ التحميل…",
          submitting: "جارٍ الإرسال…",
          retry: "إعادة المحاولة",
          close: "إغلاق",
        },
        errors: {
          network: "تعذر الاتصال بالخدمة. تحقق من الشبكة وحاول مرة أخرى.",
        },
        auth: {
          visualLabel: "اكتشاف القدرات",
          visualTitle: "اكتشف ما يميّزك، أنت.",
          visualSubtitle: "شاهد نقاط قوتك، واكتشف الفرص، وابنِ مسارك بوضوح.",
          heroAlt: "شابة تحمل حاسوبًا محمولًا",
          showPassword: "إظهار كلمة المرور",
          hidePassword: "إخفاء كلمة المرور",
        },
        fields: {
          name: "الاسم الكامل",
          email: "البريد الإلكتروني",
          password: "كلمة المرور",
          passwordConfirmation: "تأكيد كلمة المرور",
        },
        validation: {
          passwordLength: "يجب أن تتكون كلمة المرور من 10 أحرف على الأقل.",
          passwordMatch: "تأكيد كلمة المرور غير مطابق.",
          consentRequired: "يجب الموافقة على الشروط والخصوصية للمتابعة.",
        },
        signup: {
          title: "ابدأ بناء Talent DNA الخاص بك.",
          subtitle: "أنشئ حسابك لبدء رحلة اكتشاف قدراتك.",
          accept: "أوافق على <0>شروط الخدمة</0> و<1>سياسة الخصوصية</1>",
          acceptCheckbox: "الموافقة على شروط الخدمة وسياسة الخصوصية",
          submit: "أنشئ Talent DNA الخاص بي",
          haveAccount: "لديك حساب بالفعل؟",
          signIn: "تسجيل الدخول",
        },
        signin: {
          title: "مرحبًا بعودتك إلى Talent DNA.",
          subtitle: "سجّل الدخول للمتابعة واكتشاف قدراتك.",
          forgot: "نسيت كلمة المرور؟",
          submit: "تسجيل الدخول إلى Talent DNA",
          noAccount: "ليس لديك حساب؟",
          signUp: "أنشئ حسابًا",
          verified: "تم تفعيل بريدك بنجاح. سجّل الدخول للمتابعة.",
        },
        verify: {
          title: "تحقق من بريدك الإلكتروني",
          subtitle:
            "أرسلنا رابط تفعيل صالحًا لمدة 60 دقيقة. افتح بريدك لإكمال التفعيل.",
          resend: "إعادة إرسال رابط التفعيل",
          logout: "تسجيل الخروج",
          verification_link_sent: "أُرسل رابط تفعيل جديد.",
          already_verified: "هذا البريد مفعّل بالفعل.",
          expired: "انتهت صلاحية رابط التفعيل. اطلب رابطًا جديدًا.",
          invalid: "رابط التفعيل غير صالح.",
          signIn: "الانتقال إلى تسجيل الدخول",
        },
        forgot: {
          title: "نسيت كلمة المرور؟",
          subtitle:
            "أدخل بريدك وسنرسل تعليمات إعادة التعيين إن كان الحساب موجودًا.",
          submit: "إرسال تعليمات إعادة التعيين",
          success:
            "إذا كان البريد مرتبطًا بحساب، فقد أرسلنا تعليمات إعادة التعيين.",
          back: "العودة إلى تسجيل الدخول",
        },
        reset: {
          title: "إعادة تعيين كلمة المرور",
          subtitle: "اختر كلمة مرور جديدة من 10 أحرف على الأقل.",
          submit: "حفظ كلمة المرور الجديدة",
          success: "تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن.",
          invalid:
            "تعذر استخدام رابط إعادة التعيين. قد يكون غير صالح أو منتهيًا.",
        },
        consent: {
          badge: "قبل أن نبدأ",
          title: "أنت من يتحكم في Talent DNA الخاص بك.",
          lead: "صُمم Talent DNA لمساعدتك على اكتشاف قدراتك دون تحويل ملفك إلى سيرة ذاتية عامة.",
          privateTitle: "خاص افتراضيًا",
          privateBody:
            "يبقى ملفك وأدلتك خاصة، ولا ينشر التحليل أي شيء تلقائيًا.",
          reviewTitle: "اقتراحات الذكاء الاصطناعي تحتاج مراجعتك",
          reviewBody:
            "أنت من يؤكد المهارات المحتملة لاحقًا قبل أن تصبح جزءًا من Talent DNA.",
          flowLabel: "تدفق مراجعة التحليل",
          flowAnalysis: "تحليل مقترح",
          flowReview: "مراجعتك",
          notPublishedTitle: "التحليل لا يتم نشره",
          notPublishedBody:
            "إجراء التحليل لا يجعل ملفك أو أدلتك متاحة للعامة تلقائيًا.",
          dataTitle: "ما المعلومات التي قد تُستخدم لاحقًا؟",
          data: {
            profile: "بيانات الملف التي تدخلها",
            projects: "المشاريع والخبرات",
            links: "روابط GitHub وPortfolio الاختيارية",
            evidence: "الأدلة والملفات التي ترفعها",
            assessments: "إجابات التقييم عند تنفيذه لاحقًا",
          },
          deterministicTitle: "حدود الذكاء الاصطناعي والحسابات",
          deterministicBody:
            "الذكاء الاصطناعي لا يحسب Skill Signal أو Match Score. الحسابات المستقبلية تنفذها خدمات deterministic ومحددة الإصدار. لا توجد نتيجة أو Talent DNA Snapshot في هذه المرحلة.",
          accept:
            "أفهم كيفية استخدام معلوماتي وأوافق صراحة على معالجة البيانات والذكاء الاصطناعي.",
          submit: "المتابعة إلى ملفي الشخصي",
        },
        legal: {
          reviewNotice:
            "هذه مسودة MVP وليست استشارة قانونية، وتحتاج مراجعة قانونية قبل الإطلاق العام.",
          terms: {
            title: "شروط الخدمة — terms-v1",
            body: "Talent DNA AI نموذج تعليمي وتجريبي. يجب تقديم معلومات صحيحة وحماية بيانات الدخول وعدم رفع محتوى لا تملك حق استخدامه. اقتراحات المهارات والمطابقة إرشادية ولا تضمن وظيفة أو قبولًا. قد تتغير وظائف النموذج أثناء التطوير. يُمنع الاستخدام الضار ومحاولات الوصول غير المصرح به، ويُسجل القبول بالإصدار terms-v1.",
          },
          privacy: {
            title: "سياسة الخصوصية — privacy-v1",
            body: "نجمع الاسم والبريد وبيانات الجلسة اللازمة، ونحفظ كلمة المرور كـHash. قد تضيف لاحقًا معلومات الملف والأدلة والروابط ونتائج التقييم لتشغيل الحساب واستخراج مهارات محتملة وبناء نتائج تراجعها وشرح المطابقة. الملف والأدلة خاصة افتراضيًا ولا ينشر التحليل شيئًا تلقائيًا؛ أي نشر عام مستقبلي يحتاج فعلًا صريحًا. قد يعالج مزود الاستضافة وBrevo الحد الأدنى اللازم، ولا يدعي المشروع بيع بياناتك. يُسجل القبول بالإصدار privacy-v1، وحذف الحساب غير منفذ في هذه المرحلة.",
          },
        },
        profileHandoff: {
          title: "اكتملت بوابة الموافقة",
          body: "إعداد الملف الشخصي يبدأ في المرحلة التالية. لم تُضف أي حقول أو بيانات ملف تجريبية هنا.",
        },
        adminBoundary: {
          title: "تم تسجيل الدخول كمسؤول",
          body: "واجهة الإدارة خارج نطاق هذه المرحلة، ولن يتم إدخالك في رحلة الطالب.",
        },
      },
    },
    en: {
      translation: {
        common: {
          loading: "Loading…",
          submitting: "Submitting…",
          retry: "Retry",
          close: "Close",
        },
        errors: {
          network:
            "The service could not be reached. Check your connection and try again.",
        },
        auth: {
          visualLabel: "Capability discovery",
          visualTitle: "Discover what makes you, you.",
          visualSubtitle:
            "See your strengths, explore opportunities, and build your path with clarity.",
          heroAlt: "Young professional holding a laptop",
          showPassword: "Show password",
          hidePassword: "Hide password",
        },
        fields: {
          name: "Full name",
          email: "Email address",
          password: "Password",
          passwordConfirmation: "Confirm password",
        },
        validation: {
          passwordLength: "Password must be at least 10 characters.",
          passwordMatch: "Password confirmation does not match.",
          consentRequired: "Accept the terms and privacy notice to continue.",
        },
        signup: {
          title: "Start building your Talent DNA.",
          subtitle:
            "Create your account to begin discovering your capabilities.",
          accept:
            "I accept the <0>Terms of service</0> and <1>Privacy notice</1>",
          acceptCheckbox: "Accept the terms of service and privacy notice",
          submit: "Create my Talent DNA",
          haveAccount: "Already have an account?",
          signIn: "Sign in",
        },
        signin: {
          title: "Welcome back to Talent DNA.",
          subtitle: "Sign in to continue discovering your capabilities.",
          forgot: "Forgot password?",
          submit: "Sign in to Talent DNA",
          noAccount: "No account yet?",
          signUp: "Create one",
          verified: "Your email was verified. Sign in to continue.",
        },
        verify: {
          title: "Verify your email",
          subtitle:
            "We sent a verification link valid for 60 minutes. Check your inbox to continue.",
          resend: "Resend verification link",
          logout: "Sign out",
          verification_link_sent: "A new verification link was sent.",
          already_verified: "This email is already verified.",
          expired: "The verification link expired. Request a new one.",
          invalid: "The verification link is invalid.",
          signIn: "Continue to sign in",
        },
        forgot: {
          title: "Forgot your password?",
          subtitle:
            "Enter your email and we will send reset instructions if the account exists.",
          submit: "Send reset instructions",
          success:
            "If that email belongs to an account, reset instructions have been sent.",
          back: "Back to sign in",
        },
        reset: {
          title: "Reset your password",
          subtitle: "Choose a new password of at least 10 characters.",
          submit: "Save new password",
          success: "Your password was updated. You can now sign in.",
          invalid:
            "The reset link could not be used. It may be invalid or expired.",
        },
        consent: {
          badge: "Before we begin",
          title: "You control your Talent DNA.",
          lead: "Talent DNA helps you discover capabilities without turning your profile into a public résumé.",
          privateTitle: "Private by default",
          privateBody:
            "Your profile and evidence stay private, and analysis never publishes anything automatically.",
          reviewTitle: "AI suggestions need your review",
          reviewBody:
            "You confirm potential skills later before they become part of your Talent DNA.",
          flowLabel: "Analysis review flow",
          flowAnalysis: "Suggested analysis",
          flowReview: "Your review",
          notPublishedTitle: "Analysis is not published",
          notPublishedBody:
            "Running analysis never makes your profile or evidence public automatically.",
          dataTitle: "What information may be used later?",
          data: {
            profile: "Profile data you enter",
            projects: "Projects and experience",
            links: "Optional GitHub and portfolio links",
            evidence: "Evidence and files you upload",
            assessments: "Assessment answers when assessments are implemented",
          },
          deterministicTitle: "AI and calculation boundaries",
          deterministicBody:
            "AI does not calculate Skill Signal or Match Score. Future calculations run in deterministic, versioned services. No result or Talent DNA Snapshot exists in this phase.",
          accept:
            "I understand how my information is used and explicitly consent to data and AI processing.",
          submit: "Continue to profile setup",
        },
        legal: {
          reviewNotice:
            "This MVP draft is not legal advice and requires legal review before public launch.",
          terms: {
            title: "Terms of service — terms-v1",
            body: "Talent DNA AI is an educational and experimental MVP. Users must provide accurate information, protect credentials, and only upload content they have the right to use. Skill suggestions and matching are guidance and do not guarantee employment or acceptance. MVP functionality may change. Harmful use and unauthorized access attempts are prohibited. Acceptance is recorded as terms-v1.",
          },
          privacy: {
            title: "Privacy notice — privacy-v1",
            body: "We collect name, email, and required session data, and store passwords as hashes. Later you may add profile details, evidence, links, and assessment results to operate the account, extract potential skills, build user-reviewed results, and explain matching. Profiles and evidence are private by default; analysis publishes nothing automatically, and future public publication requires explicit action. Hosting providers and Brevo may process the minimum required data. The project does not claim to sell user data. Acceptance is recorded as privacy-v1. Account deletion is not implemented in this phase.",
          },
        },
        profileHandoff: {
          title: "Consent gate complete",
          body: "Profile setup begins in the next phase. No profile fields or sample profile data were added here.",
        },
        adminBoundary: {
          title: "Signed in as an administrator",
          body: "Administration UI is outside this phase, so the student journey is not shown.",
        },
      },
    },
  },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language === "en" ? "en" : "ar";
  document.documentElement.dir = i18n.language === "en" ? "ltr" : "rtl";
}

export default i18n;
