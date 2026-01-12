import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { setupAxiosInterceptors } from "../lib/api";

export interface User {
  id?: string;
  name?: string;
  email?: string;
  // Add more fields if your backend sends them
  [key: string]: any;
}

export interface Job {
  id?: string;
  title?: string;
  company?: string;
  status?: string;
  // Extend as needed
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  jobs: Job[];
  storeJobs: (jobs: Job[] | ((prev: Job[]) => Job[])) => void;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const STORAGE_KEY_JOBS = "jobs";
  const STORAGE_KEY_TOKEN = "token";
  const STORAGE_KEY_USER = "user";

  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY_TOKEN)
  );
  const [loading, setLoading] = useState<boolean>(true);

  const safeParse = <T,>(raw: string | null): T | null => {
    try {
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn("safeParse failed:", e, raw);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    const storedJobs = localStorage.getItem(STORAGE_KEY_JOBS);

    if (storedToken && storedUser) {
      setToken(storedToken);

      const parsedUser = safeParse<User>(storedUser);
      setUser(parsedUser);

      const parsedJobs = safeParse<Job[]>(storedJobs);
      setJobs(Array.isArray(parsedJobs) ? parsedJobs : []);

      setupAxiosInterceptors(storedToken);
    } else {
      const parsedJobs = safeParse<Job[]>(storedJobs);
      setJobs(Array.isArray(parsedJobs) ? parsedJobs : []);
    }

    setLoading(false);
  }, []);

  const persistJobs = useCallback((nextJobs: Job[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(nextJobs));
    } catch (e) {
      console.error("persistJobs failed:", e);
    }
  }, []);

  const storeJobs = useCallback(
    (jobsDataOrUpdater: Job[] | ((prev: Job[]) => Job[])) => {
      setJobs((prev) => {
        let next: Job[];

        if (typeof jobsDataOrUpdater === "function") {
          try {
            next = jobsDataOrUpdater(prev);
          } catch (e) {
            console.error("storeJobs updater threw:", e);
            next = prev;
          }
        } else {
          next = jobsDataOrUpdater;
        }

        const safeNext = Array.isArray(next) ? next : [];
        persistJobs(safeNext);
        return safeNext;
      });
    },
    [persistJobs]
  );

  const login = useCallback((userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);

    try {
      localStorage.setItem(STORAGE_KEY_TOKEN, authToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    } catch (e) {
      console.error("login localStorage write failed:", e);
    }

    setupAxiosInterceptors(authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setJobs([]);

    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_JOBS);
    } catch (e) {
      console.error("logout localStorage cleanup failed:", e);
    }

    setupAxiosInterceptors(null);
  }, []);

  const isAuthenticated = useCallback(() => !!token, [token]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      jobs,
      storeJobs,
      login,
      logout,
      isAuthenticated,
      loading,
    }),
    [user, token, jobs, storeJobs, login, logout, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
