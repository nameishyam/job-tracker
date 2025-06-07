import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from "react";
import "./navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
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
  };

  const handleHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("user-dropdown");
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !event.target.closest(".user-icon-container")
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
          <div className="navbar-logo">
            <Link to="/" className="navbar-brand">
              Job Tracker
            </Link>
          </div>{" "}
          <div className="navbar-links">
            {isAuthenticated() ? (
              <>
                <div className="user-menu-container">
                  <div className="user-icon-container" onClick={toggleDropdown}>
                    <AccountCircleIcon className="user-icon" />
                  </div>
                  {dropdownOpen && (
                    <div id="user-dropdown" className="user-dropdown">
                      <div className="dropdown-user-info">
                        <AccountCircleIcon className="dropdown-user-icon" />
                        <span className="dropdown-user-name">
                          {user ? `${user.firstName} ${user.lastName}` : "User"}
                        </span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button
                        onClick={handleHome}
                        className="dropdown-logout-button"
                      >
                        Home
                      </button>
                      <button
                        onClick={handleDashboard}
                        className="dropdown-logout-button"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="dropdown-logout-button"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
