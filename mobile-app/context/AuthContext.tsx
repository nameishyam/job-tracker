import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setupAxiosInterceptors } from "../utils/api";

interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setupAxiosInterceptors(storedToken);
        }
      } catch (error) {
        console.error("Error loading stored auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (userData: User, authToken: string) => {
    try {
      setUser(userData);
      setToken(authToken);
      await AsyncStorage.setItem("token", authToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setupAxiosInterceptors(authToken);
    } catch (error) {
      console.error("Error storing auth data:", error);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.multiRemove(["token", "user"]);
      setupAxiosInterceptors(null);
    } catch (error) {
      console.error("Error removing auth data:", error);
    }
  };

  const isAuthenticated = (): boolean => {
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
