import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type { User, Job, AuthContextType, Review } from "@/lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        setUser(res.data.user);
        setJobs(res.data.jobs);
        setReviews(res.data.reviews);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setUser(null);
          setJobs([]);
          setReviews([]);
        } else {
          console.error("Unexpected /me error:", err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/users/logout");
    } catch (err) {
      console.log(err);
    }
    setUser(null);
    setJobs([]);
    setReviews([]);
  }, []);

  const isAuthenticated = useCallback(() => !!user, [user]);

  const value = useMemo(
    () => ({
      user,
      jobs,
      reviews,
      setReviews,
      setJobs,
      login,
      logout,
      isAuthenticated,
      loading,
    }),
    [user, jobs, login, logout, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
