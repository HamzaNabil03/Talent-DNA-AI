import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Activity, Languages } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useHealth } from "../shared/api/health";

function BootstrapPage() {
  const { i18n, t } = useTranslation();
  const health = useHealth();

  const setLanguage = async (language: "ar" | "en") => {
    await i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  };

  return (
    <main className="bootstrap" aria-labelledby="bootstrap-title">
      <section className="bootstrap__panel">
        <p className="bootstrap__eyebrow">Talent DNA AI</p>
        <h1 id="bootstrap-title">{t("title")}</h1>
        <p>{t("description")}</p>
        <div className="bootstrap__status" aria-live="polite">
          <Activity aria-hidden="true" size={20} />
          <span>{t("api")}</span>
          <strong data-status={health.status}>
            {health.isPending
              ? t("checking")
              : health.isSuccess
                ? t("available")
                : t("unavailable")}
          </strong>
        </div>
        <div className="bootstrap__languages" aria-label={t("language")}>
          <Languages aria-hidden="true" size={18} />
          <button type="button" onClick={() => void setLanguage("ar")}>
            العربية
          </button>
          <button type="button" onClick={() => void setLanguage("en")}>
            English
          </button>
        </div>
      </section>
    </main>
  );
}

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<BootstrapPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
