import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post(`${import.meta.env.VITE_API_URL}/users/login`, formData)
      .then((response) => {
        if (response.status === 200) {
          login(response.data.user, response.data.token);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.log(`error logging in the user: ${error}`);
        if (error.response?.status === 400) {
          setError("Invalid email or password. Please try again.");
        } else if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          setError("Authentication failed. Please try again.");
        } else {
          setError("An error occurred while logging in. Please try again.");
        }
      });
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-grid">
          <div className="login-content">
            <div className="login-heading-wrapper">
              <h1 className="login-heading">
                Welcome
                <span className="login-heading-accent">Back!</span>
              </h1>
              <p className="login-subtitle">
                Sign in to your account and continue organizing all of your jobs
                with our intuitive dashboard.
              </p>
            </div>
          </div>

          <div className="login-form-container">
            <div className="login-form-wrapper">
              <div className="login-form-card">
                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="login-field">
                    <label className="login-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="login-input"
                    />
                  </div>{" "}
                  <div className="login-field">
                    <label className="login-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="login-input"
                    />
                  </div>
                  {error && <div className="login-error">{error}</div>}
                  <button type="submit" className="login-button">
                    Login
                  </button>
                </form>

                <div className="login-footer">
                  <p className="login-footer-text">
                    New to the application?{" "}
                    <Link to="/signup" className="login-footer-link">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
