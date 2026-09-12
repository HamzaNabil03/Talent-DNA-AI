import i18n from "i18next";
import { initReactI18next } from "react-i18next";

void i18n.use(initReactI18next).init({
  lng: "ar",
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
  resources: {
    ar: {
      translation: {
        title: "تم تجهيز الأساس التقني",
        description:
          "صفحة تحقق محايدة للاتجاه والخطوط ورموز التصميم والاتصال بواجهة API.",
        api: "حالة واجهة API",
        checking: "جارٍ التحقق",
        available: "متاحة",
        unavailable: "غير متاحة",
        language: "اللغة",
      },
    },
    en: {
      translation: {
        title: "Technical foundation ready",
        description:
          "A neutral bootstrap proving direction, fonts, design tokens, routing, and API connectivity.",
        api: "API status",
        checking: "Checking",
        available: "Available",
        unavailable: "Unavailable",
        language: "Language",
      },
    },
  },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language === "en" ? "en" : "ar";
  document.documentElement.dir = i18n.language === "en" ? "ltr" : "rtl";
}

export default i18n;
