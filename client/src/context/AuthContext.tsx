import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  useEffect,
} from "react";
import { api } from "@/lib/api";
import type { User, Job, AuthContextType, Review } from "@/lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get("/me/me");
      setUser(res.data.user);
      setJobs(res.data.jobs);
      setReviews(res.data.reviews);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setUser(null);
        setJobs([]);
        setReviews([]);
      } else {
        console.error("Unexpected /me error:", err);
      }
    }
  }, []);

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, [fetchMe]);

  const login = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log(err);
    }
    setUser(null);
    setJobs([]);
    setReviews([]);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const isAuthenticated = useCallback(() => !!user, [user]);

  const value = useMemo(
    () => ({
      user,
      jobs,
      reviews,
      setReviews,
      setJobs,
      updateUser,
      login,
      logout,
      isAuthenticated,
      loading,
    }),
    [user, jobs, reviews, login, logout, isAuthenticated, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
