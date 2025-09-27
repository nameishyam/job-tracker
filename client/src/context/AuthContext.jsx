import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { setupAxiosInterceptors } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedJobs = localStorage.getItem("jobs");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setJobs(JSON.parse(storedJobs) || []);
      setupAxiosInterceptors(storedToken);
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setupAxiosInterceptors(authToken);
  }, []);

  const storeJobs = useCallback((jobsData) => {
    setJobs(jobsData);
    localStorage.setItem("jobs", JSON.stringify(jobsData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setJobs([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("jobs");
    setupAxiosInterceptors(null);
  }, []);

  const isAuthenticated = useCallback(() => !!token, [token]);

  const value = useMemo(
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

export const useAuth = () => useContext(AuthContext);
