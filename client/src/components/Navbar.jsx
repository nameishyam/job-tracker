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
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link
            to="/"
            className="text-lg font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            JobTracker
          </Link>

          <div className="flex items-center space-x-3">
            {/* <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileTap={{ scale: 0.95 }}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDark ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </motion.button> */}

            {isAuthenticated() ? (
              <div className="relative user-menu">
                <motion.button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <UserCircleIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                    {user?.firstName}
                  </span>
                </motion.button>

                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                  >
                    <Link to="/profile" onClick={handleUserChange}>
                      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <HomeIcon className="w-4 h-4 mr-2" />
                      Home
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChartBarIcon className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      Logout
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete Account
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
