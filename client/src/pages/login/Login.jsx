import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-grid">
          <div className="login-content">
            <div className="login-heading-wrapper">
              <h1 className="login-heading">
                Welcome to{" "}
                <span className="login-heading-accent">JobTracker</span>
              </h1>
              <p className="login-subtitle">
                Take control of your job search journey. Track applications,
                manage interviews, and land your dream job with our
                comprehensive platform.
              </p>
            </div>
          </div>

          <div className="login-form-container">
            <div className="login-form-wrapper">
              <motion.div
                className="login-form-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {error && (
                  <motion.div
                    className="login-error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="login-field">
                    <label className="login-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="login-input"
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="login-field">
                    <label className="login-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="login-input"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner small"></div>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>
                </form>

                <div className="login-footer">
                  <p className="login-footer-text">
                    Don't have an account?{" "}
                    <Link to="/signup" className="login-footer-link">
                      Sign up
                    </Link>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
