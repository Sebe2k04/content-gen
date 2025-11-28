import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { getQueryClient } from "@/utils/api";
import { userTokenCookieName } from "@/utils/common";

// === Types ===
interface UserDetails {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

interface UserContextType {
  user: UserDetails | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

// === Context ===
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used inside <UserProvider>");
  }
  return context;
};

// === Provider ===
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const client = getQueryClient();
  const router = useRouter();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const redirectToLogin = () => {
    // Cookies.remove(userTokenCookieName);
    // if (router.pathname.includes("/dashboard")) {
    //   router.replace("/auth");
    // }
  };


  // 🔄 Fetch user profile
  const fetchUser = async () => {
    try {
            const res = await client.user.getProfile.query({});

      if (res.status === 200) {
        setUser(res.body);
        return;
      }
    } catch (err) {
      redirectToLogin();
    }
  };
  

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
    setLoading(false);
  };

  // First load
  useEffect(() => {
    const tokenExists = Cookies.get(userTokenCookieName);
    if (!tokenExists) {
      redirectToLogin();
      return;
    }

    refreshUser();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
