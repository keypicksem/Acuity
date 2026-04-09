import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  getStoredUser,
  setStoredUser,
  signOut as clearSession,
  type User,
} from "@/lib/auth";
import { api } from "@/lib/api";

type AuthState = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  signOut: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      // Try to get session from the API (cookie-based)
      const data = await api.get<{ user?: User }>("/api/auth/session");
      if (data.user?.id) {
        setUser(data.user);
        await setStoredUser(data.user);
      } else {
        // Fall back to stored user
        const stored = await getStoredUser();
        setUser(stored);
      }
    } catch {
      const stored = await getStoredUser();
      setUser(stored);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    try {
      await api.post("/api/auth/signout", {});
    } catch {
      // Ignore signout API errors
    }
    await clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
