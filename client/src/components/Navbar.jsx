import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { openDeleteModal } = useModal();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const handleUserChange = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  const handleDeleteAccount = () => {
    openDeleteModal();
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl font-bold text-white drop-shadow-sm hover:text-cyan-300 transition-all duration-300 hover:scale-105"
            >
              JobTracker
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium text-white/80 hover:text-white transition-all duration-300 glass-button px-4 py-2"
            >
              Blogs
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full glass-button hover:scale-110 transition-all duration-300"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5 text-white" />
              ) : (
                <MoonIcon className="w-5 h-5 text-white" />
              )}
            </motion.button>

            {isAuthenticated() ? (
              <div className="relative user-menu">
                <motion.button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-full glass-button hover:scale-105 transition-all duration-300"
                  whileTap={{ scale: 0.95 }}
                >
                  <UserCircleIcon className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white hidden sm:block">
                    {user?.firstName}
                  </span>
                </motion.button>

                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl shadow-lg overflow-hidden glass-dropdown"
                  >
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                      <div className="px-4 py-3 border-b border-white/10 hover:bg-white/10 transition-all duration-300">
                        <p className="text-sm font-semibold text-white truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-white/70 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </Link>

                    <div className="py-1">
                      <Link
                        to="/"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-300"
                      >
                        <HomeIcon className="w-4 h-4 mr-3" /> Home
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-300"
                      >
                        <ChartBarIcon className="w-4 h-4 mr-3" /> Dashboard
                      </Link>
                    </div>

                    <div className="py-1 border-t border-white/10">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-300"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition-all duration-300"
                      >
                        <TrashIcon className="w-4 h-4 mr-3" /> Delete Account
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="glass-button px-4 py-1.5 text-sm font-semibold text-white hover:scale-105 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="glass-button px-4 py-1.5 text-sm font-semibold text-white hover:scale-105 transition-all duration-300"
                >
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