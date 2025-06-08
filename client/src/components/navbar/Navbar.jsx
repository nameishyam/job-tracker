import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useModal } from "../../context/ModalContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { openDeleteModal } = useModal();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const handleDeleteAccount = () => {
    openDeleteModal();
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDashboard = () => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
    setDropdownOpen(false);
  };

  const handleHome = () => {
    navigate("/");
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("user-dropdown");
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !event.target.closest(".user-menu-container")
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo Section */}
          <div className="navbar-logo">
            <Link to="/" className="navbar-brand">
              JobTracker
            </Link>
          </div>

          {/* Actions Section */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <motion.button
              className={`theme-toggle ${isDark ? "active" : ""}`}
              onClick={toggleTheme}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <motion.div
                className="theme-toggle-slider"
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {isDark ? "🌙" : "☀️"}
              </motion.div>
            </motion.button>

            {/* Auth Links */}
            {isAuthenticated() ? (
              <div className="user-menu-container">
                <button
                  className="user-avatar"
                  onClick={toggleDropdown}
                  aria-label="User menu"
                >
                  <div className="user-initial">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      id="user-dropdown"
                      className="user-dropdown"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="dropdown-header">
                        <div className="user-info">
                          <div className="user-name">
                            {user
                              ? `${user.firstName} ${user.lastName}`
                              : "User"}
                          </div>
                          <div className="user-email">{user?.email}</div>
                        </div>
                      </div>

                      <div className="dropdown-divider"></div>

                      <div className="dropdown-actions">
                        <button onClick={handleHome} className="dropdown-item">
                          <span>🏠</span>
                          Home
                        </button>
                        <button
                          onClick={handleDashboard}
                          className="dropdown-item"
                        >
                          <span>📊</span>
                          Dashboard
                        </button>
                        <button
                          onClick={handleLogout}
                          className="dropdown-item"
                        >
                          <span>🚪</span>
                          Logout
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="dropdown-item danger"
                        >
                          <span>🗑️</span>
                          Delete Account
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
