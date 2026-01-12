import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./routes/PublicRoute";
import Signup from "./pages/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  return (
    <>
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
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                </Route>
              </Routes>
            </div>
          </BrowserRouter>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
