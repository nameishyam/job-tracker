import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "@/pages/Landing";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import PublicRoute from "@/routes/PublicRoute";
import Signup from "@/pages/Signup";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Reviews from "@/pages/Reviews";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route element={<PublicRoute />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>
              <Route path="/reviews" element={<Reviews />} />
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}
