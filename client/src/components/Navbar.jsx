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
    <nav className="sticky top-0 z-50 duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl font-bold text-white drop-shadow-sm hover:text-cyan-300 transition-colors"
            >
              JobTracker
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated() ? (
              <div className="relative user-menu">
                <motion.button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-full transition-colors duration-300
                         border border-transparent hover:border-gray-300/50 dark:hover:border-white/20
                         hover:bg-white/20 dark:hover:bg-black/20"
                  whileTap={{ scale: 0.95 }}
                >
                  <UserCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                    {user?.firstName}
                  </span>
                </motion.button>

                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl shadow-lg overflow-hidden
                           border border-white/20
                           backdrop-blur-xl bg-white/70 dark:bg-gray-900/70"
                  >
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                      <div className="px-4 py-3 border-b border-gray-200/80 dark:border-gray-700/80 hover:bg-black/5 dark:hover:bg-white/5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </Link>

                    <div className="py-1">
                      <Link
                        to="/"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <HomeIcon className="w-4 h-4 mr-3" /> Home
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <ChartBarIcon className="w-4 h-4 mr-3" /> Dashboard
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-200/80 dark:border-gray-700/80">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />{" "}
                        Logout
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10"
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
                  className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold
                         transition-all duration-300 backdrop-blur-lg
                         border bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold 
                         text-white transition-all duration-300 backdrop-blur-lg
                         bg-cyan-500/20 hover:bg-cyan-500/30
                         border border-cyan-400/50 hover:border-cyan-400/70"
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
