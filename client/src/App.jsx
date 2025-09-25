import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Blogpage from "./pages/Blogpage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";

const App = () => {
  return (
    <div className="app-shell transition-theme">
      <div className="app-bg" aria-hidden="true">
        <div className="app-blob app-blob--teal" />
        <div className="app-blob app-blob--violet" />
        <div className="app-grid-overlay" />
      </div>
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
  );
};

export default App;
