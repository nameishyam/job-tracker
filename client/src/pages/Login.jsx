import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Prism from "../styles/Prism";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        formData
      );
      if (response.status === 200) {
        login(response.data.user, response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full relative prism-container">
          <Prism
            animationType="3drotate"
            timeScale={0.3}
            height={4}
            baseWidth={6}
            scale={4}
            hueShift={45}
            colorFrequency={0.8}
            noise={0.1}
            glow={0.7}
          />
          <div className="absolute inset-0 glass-overlay" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-form p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-white/70">
              Sign in to your JobTracker account
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 glass-effect-strong rounded-lg border border-red-400/30 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 glass-input focus:scale-105 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 glass-button font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:scale-105 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/70">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-white font-medium hover:text-cyan-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;