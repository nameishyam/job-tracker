import { createContext, useState, useContext, useEffect } from "react";
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
      setJobs(JSON.parse(storedJobs));
      setupAxiosInterceptors(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setupAxiosInterceptors(authToken);
  };

  const storeJobs = (jobsData) => {
    setJobs(jobsData);
    localStorage.setItem("jobs", JSON.stringify(jobsData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setJobs([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("jobs");
    setupAxiosInterceptors(null);
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        jobs,
        storeJobs,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
