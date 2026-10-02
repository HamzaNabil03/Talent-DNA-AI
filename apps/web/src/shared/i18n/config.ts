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
        landing: {
          meta: {
            title: "Talent DNA AI — اكتشف قدراتك الحقيقية",
            description:
              "حوّل خبراتك ومشاريعك إلى صورة واضحة لقدراتك مع Talent DNA AI.",
          },
          nav: {
            label: "التنقل الرئيسي",
            open: "فتح القائمة",
            close: "إغلاق القائمة",
            how: "كيف تعمل",
            methodology: "المنهجية",
            trust: "الثقة والأدلة",
            organizations: "للمؤسسات",
            signIn: "تسجيل الدخول",
            discover: "اكتشف قدراتي",
          },
          hero: {
            badge: "اكتشاف المواهب بالذكاء الاصطناعي",
            titleStart: "قدراتك،",
            titleAccent: "أصبحت مرئية.",
            subtitleStart: "اكتشف ما",
            subtitleAccent: "تجيده فعلاً.",
            body: "يحوّل Talent DNA AI مشاريعك وخبراتك ومهاراتك وتقييماتك إلى صورة واضحة عمّا تستطيع فعله حقًا — ليساعدك على اكتشاف نقاط قوتك، وإثبات قدراتك، وإيجاد الفرص التي تناسبك.",
            primary: "اكتشف قدراتي",
            secondary: "شاهد كيف يعمل Talent DNA",
          },
          metrics: {
            label: "مؤشرات Talent DNA",
            privacy: { value: "100%", label: "خصوصية وأمان بياناتك" },
            opportunities: { value: "+250K", label: "فرصة مهنية موصى بها" },
            analysis: { value: "+2.5M", label: "تحليل مهاري ذكي" },
            users: { value: "+500K", label: "مستخدم حول العالم" },
          },
          capability: {
            titleStart: "قدرات حقيقية،",
            titleAccent: "لا مجرد ادعاءات.",
            body: "يتجاوز Talent DNA AI ما تقوله عن نفسك؛ ليبني صورة أوضح عن القدرة الفعلية بجمع الأدلة وتحليل الذكاء الاصطناعي والتقييم.",
            cards: {
              self: {
                title: "مصرّح بها ذاتيًا",
                body: "ما تقول إنك قادر على فعله.",
              },
              ai: {
                title: "مستنتجة بالذكاء الاصطناعي",
                body: "ما يستنتجه الذكاء الاصطناعي من خبراتك ومشاريعك.",
              },
              evidence: {
                title: "مدعومة بالأدلة",
                body: "ما تثبته مشاريعك وأعمالك وإنجازاتك.",
              },
              assessment: {
                title: "مدعومة بالتقييم",
                body: "ما تقيسه التقييمات المعتمدة.",
              },
            },
          },
          profile: {
            label: "نموذج بطاقة Talent DNA",
            score: "درجة الموهبة",
            description:
              "بصمة قدرات مبنية على الأدلة والتقييمات وتحليل الذكاء الاصطناعي.",
            skills: {
              creative: "التفكير الإبداعي",
              problem: "حل المشكلات",
              communication: "التواصل",
              adaptability: "القدرة على التكيف",
              technical: "المهارات التقنية",
            },
            proof: {
              projects: "3 مشاريع محللة",
              experience: "خبرة عملية مراجعة",
              portfolio: "معرض أعمال مراجع",
              validated: "مهارات موثقة",
            },
          },
          journey: {
            titleStart: "كيف يعمل",
            titleAccent: "Talent DNA",
            titleEnd: "؟",
            body: "من اكتشاف نقاط قوتك إلى معرفة أين يمكن أن تأخذك.",
            steps: {
              discover: {
                title: "الاكتشاف",
                body: "افهم خبراتك واهتماماتك ونقاط قوتك وإمكاناتك.",
              },
              prove: {
                title: "الإثبات",
                body: "اربط قدراتك بمشاريع حقيقية وأدلة وتقييمات.",
              },
              match: {
                title: "المطابقة",
                body: "اكتشف الأدوار والفرص والمسارات المهنية المتوافقة مع Talent DNA الخاص بك.",
              },
              grow: {
                title: "النمو",
                body: "تابع تطورك وعزّز قدراتك باستمرار.",
              },
            },
          },
          trust: {
            titleStart: "الثقة",
            titleAccent: "بالتصميم.",
            body: "كل إشارة قدرة شفافة وقابلة للتتبع وموسومة بوضوح؛ لا يتعامل Talent DNA AI مع كل استنتاج كحقيقة، بل يحمل كل إشارة مستوى التحقق الخاص بها.",
            cards: {
              self: {
                title: "مصرّح بها ذاتيًا",
                question: "ما تقوله عن نفسك",
                body: "المهارات والخبرات والاهتمامات والقدرات التي تذكرها بنفسك.",
                tag: "مذكورة من المستخدم",
              },
              ai: {
                title: "مستنتجة بالذكاء الاصطناعي",
                question: "ما يستنتجه الذكاء الاصطناعي",
                body: "أنماط وقدرات مستنتجة من خبراتك ومشاريعك وسلوكك.",
                tag: "تحليل الذكاء الاصطناعي",
              },
              evidence: {
                title: "مدعومة بالأدلة",
                question: "ما تثبته أعمالك",
                body: "قدرات مدعومة بمشاريع حقيقية ونماذج أعمال وإنجازات.",
                tag: "أدلة موثقة",
              },
              assessment: {
                title: "مدعومة بالتقييم",
                question: "ما تقيسه التقييمات المعتمدة",
                body: "قدرات مدعومة بتقييمات منظمة ونتائج قابلة للقياس.",
                tag: "تقييمات معتمدة",
              },
            },
          },
          cta: {
            title: "هل أنت مستعد لاكتشاف Talent DNA الخاص بك؟",
            body: "حوّل خبراتك إلى صورة أوضح عن قدراتك — واكتشف إلى أين يمكن أن تأخذك.",
            primary: "اكتشف قدراتي",
            secondary: "شاهد كيف يعمل Talent DNA",
          },
          footer: {
            tagline: "اكتشف ما تجيده فعلاً.",
            social: "روابط التواصل الاجتماعي",
            platform: {
              title: "المنصة",
              one: "الاكتشاف",
              two: "Talent DNA",
              three: "التقييمات",
              four: "الفرص",
            },
            resources: {
              title: "الموارد",
              one: "كيف تعمل",
              two: "المنهجية",
              three: "الثقة والأدلة",
              four: "الأسئلة الشائعة",
            },
            company: {
              title: "الشركة",
              one: "من نحن",
              two: "تواصل معنا",
              three: "الوظائف",
              four: "البيئة الشاملة",
            },
            legal: {
              title: "قانوني",
              one: "سياسة الخصوصية",
              two: "شروط الاستخدام",
            },
            copyright: "جميع الحقوق محفوظة.",
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
        landing: {
          meta: {
            title: "Talent DNA AI — Make your capabilities visible",
            description:
              "Turn your projects and experiences into a clear picture of your capabilities with Talent DNA AI.",
          },
          nav: {
            label: "Main navigation",
            open: "Open menu",
            close: "Close menu",
            how: "How It Works",
            methodology: "Methodology",
            trust: "Trust & Evidence",
            organizations: "For Organizations",
            signIn: "Sign In",
            discover: "Discover My Capabilities",
          },
          hero: {
            badge: "AI-powered talent discovery",
            titleStart: "Your capabilities.",
            titleAccent: "Made visible.",
            subtitleStart: "Discover what you can",
            subtitleAccent: "actually do.",
            body: "Talent DNA AI transforms your projects, experiences, skills, and assessments into a clear picture of what you can actually do — helping you discover your strengths, prove your capabilities, and find opportunities that fit you.",
            primary: "Discover My Capabilities",
            secondary: "See how Talent DNA works",
          },
          metrics: {
            label: "Talent DNA indicators",
            privacy: { value: "100%", label: "Privacy and data security" },
            opportunities: {
              value: "+250K",
              label: "Recommended opportunities",
            },
            analysis: { value: "+2.5M", label: "Intelligent skill analyses" },
            users: { value: "+500K", label: "Users around the world" },
          },
          capability: {
            titleStart: "Capability,",
            titleAccent: "not claims.",
            body: "Talent DNA goes beyond what people say about themselves. It builds a clearer picture of capability by combining evidence, AI analysis, and assessments.",
            cards: {
              self: {
                title: "Self-declared",
                body: "What you say you can do.",
              },
              ai: {
                title: "AI-inferred",
                body: "What AI identifies from your experiences and work.",
              },
              evidence: {
                title: "Evidence-supported",
                body: "What your real projects and work demonstrate.",
              },
              assessment: {
                title: "Assessment-supported",
                body: "What validated assessments measure.",
              },
            },
          },
          profile: {
            label: "Talent DNA profile card example",
            score: "Talent Score",
            description:
              "A capability fingerprint generated from evidence, assessments, and AI analysis across five core areas.",
            skills: {
              creative: "Creative Thinking",
              problem: "Problem Solving",
              communication: "Communication",
              adaptability: "Adaptability",
              technical: "Technical Skills",
            },
            proof: {
              projects: "3 Projects analyzed",
              experience: "Experience analyzed",
              portfolio: "Portfolio reviewed",
              validated: "Skills cross-validated",
            },
          },
          journey: {
            titleStart: "How",
            titleAccent: "Talent DNA",
            titleEnd: "works",
            body: "From discovering your strengths to finding where they can take you.",
            steps: {
              discover: {
                title: "Discover",
                body: "Understand your experiences, interests, strengths, and potential.",
              },
              prove: {
                title: "Prove",
                body: "Connect your capabilities to real projects, evidence, and assessments.",
              },
              match: {
                title: "Match",
                body: "Discover roles, opportunities, and career paths aligned with your Talent DNA.",
              },
              grow: {
                title: "Grow",
                body: "Track your development and continuously strengthen your capabilities.",
              },
            },
          },
          trust: {
            titleStart: "Trust by",
            titleAccent: "design.",
            body: "Every capability signal is transparent, traceable, and clearly labeled. Talent DNA never treats an AI insight as fact — each signal carries its own level of verification.",
            cards: {
              self: {
                title: "Self-declared",
                question: "What you tell us.",
                body: "Skills, experiences, interests, and capabilities you report yourself.",
                tag: "User reported",
              },
              ai: {
                title: "AI-inferred",
                question: "What AI identifies.",
                body: "Patterns and capabilities inferred from your experiences, projects, and behavior.",
                tag: "AI analysis",
              },
              evidence: {
                title: "Evidence-supported",
                question: "What your work proves.",
                body: "Capabilities supported by real projects, portfolios, work samples, and achievements.",
                tag: "Evidence verified",
              },
              assessment: {
                title: "Assessment-supported",
                question: "What validated assessments measure.",
                body: "Capabilities supported by structured assessments and measurable results.",
                tag: "Assessment validated",
              },
            },
          },
          cta: {
            title: "Ready to discover your Talent DNA?",
            body: "Turn your experiences into a clearer picture of your capabilities — and discover where they can take you next.",
            primary: "Discover My Capabilities",
            secondary: "See how Talent DNA works",
          },
          footer: {
            tagline: "Discover what you can actually do.",
            social: "Social media links",
            platform: {
              title: "Platform",
              one: "Discover",
              two: "Talent DNA",
              three: "Assessments",
              four: "Opportunities",
            },
            resources: {
              title: "Resources",
              one: "How It Works",
              two: "Methodology",
              three: "Trust & Evidence",
              four: "FAQ",
            },
            company: {
              title: "Company",
              one: "About",
              two: "Contact",
              three: "Careers",
              four: "Inclusive Environment",
            },
            legal: {
              title: "Legal",
              one: "Privacy Policy",
              two: "Terms of Use",
            },
            copyright: "All rights reserved.",
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
