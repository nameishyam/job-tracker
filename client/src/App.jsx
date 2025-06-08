import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/landing/Landing";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
