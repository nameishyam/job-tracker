import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";

const App = () => {
  return (
    <ThemeProvider>
      <div className="app-container transition-theme">
        <AuthProvider>
          <ModalProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Landing />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </ModalProvider>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
};

export default App;
