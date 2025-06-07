import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }
    const { confirmPassword, ...dataToSend } = formData;
    axios
      .post(`${import.meta.env.VITE_API_URL}/users/signup`, dataToSend)
      .then((response) => {
        if (response.status === 201) {
          login(response.data.user, response.data.token);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        if (error.response?.status === 400) {
          setError("User already exists");
        } else {
          setError(
            "An error occurred while creating the user. Please try again."
          );
        }
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="signup-grid">
          <div className="signup-content">
            <div className="signup-heading-wrapper">
              <h1 className="signup-heading">
                New to the
                <span className="signup-heading-accent">Application?</span>
              </h1>
              <p className="signup-subtitle">
                Sign up now to get started and organize all of your jobs in one
                place with our intuitive dashboard.
              </p>
            </div>
          </div>

          <div className="signup-form-container">
            <div className="signup-form-wrapper">
              <div className="signup-form-card">
                <form className="signup-form" onSubmit={handleSubmit}>
                  <div className="signup-name-grid">
                    <div>
                      <label className="signup-label">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        name="firstName"
                        required
                        className="signup-input"
                      />
                    </div>
                    <div>
                      <label className="signup-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="signup-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="signup-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="signup-input"
                    />
                  </div>

                  <div>
                    <label className="signup-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="signup-input"
                    />
                  </div>

                  <div>
                    <label className="signup-label">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="signup-input"
                    />
                  </div>

                  {error && <div className="signup-error">{error}</div>}

                  <button type="submit" className="signup-button">
                    Sign Up
                  </button>
                </form>

                <div className="signup-footer">
                  <p className="signup-footer-text">
                    Already have an account?{" "}
                    <Link to="/login" className="signup-footer-link">
                      Login here
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

export default Signup;
