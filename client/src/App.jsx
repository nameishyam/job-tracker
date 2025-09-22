import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";
import Blogpage from "./pages/Blogpage";

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
                  <Route path="blog" element={<Blogpage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
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
