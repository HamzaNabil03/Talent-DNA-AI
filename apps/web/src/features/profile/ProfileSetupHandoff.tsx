import { useTranslation } from "react-i18next";
import { authApi } from "../../shared/api/auth";
import { useSession } from "../../shared/auth/SessionContext";
import { AuthLayout } from "../auth/AuthComponents";

export function ProfileSetupHandoff() {
  const { t } = useTranslation();
  const { setSession } = useSession();
  const logout = async () => {
    await authApi.logout();
    setSession(null);
    window.location.assign("/auth/sign-in");
  };
  return (
    <AuthLayout>
      <div className="auth-heading">
        <h1>{t("profileHandoff.title")}</h1>
        <p>{t("profileHandoff.body")}</p>
      </div>
      <button
        className="secondary-button full-width"
        type="button"
        onClick={() => void logout()}
      >
        {t("verify.logout")}
      </button>
    </AuthLayout>
  );
}
