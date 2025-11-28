import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { userTokenCookieName } from "@/utils/common";

export default function OAuthCallback() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (typeof token === "string") {
      Cookies.set(userTokenCookieName, token, { expires: 7, path: "/" });
      router.replace("/dashboard");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600 text-sm animate-pulse">
        Logging you in…
      </p>
    </div>
  );
}
