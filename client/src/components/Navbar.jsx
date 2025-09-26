import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  HomeIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
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
    setDropdownOpen((prev) => !prev);
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
    <nav className="sticky top-0 left-0 right-0 z-50 bg-[var(--bg-primary)] dark-panel dark-panel--surface border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-lg sm:text-xl font-semibold tracking-tight text-gradient drop-shadow"
          >
            JobTracker
          </Link>
          <Link
            to="/blog"
            className="text-sm font-medium text-slate-200/80 hover:text-slate-50 transition-colors"
          >
            Blogs
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {isAuthenticated() ? (
            <div className="relative user-menu">
              <motion.button
                onClick={toggleDropdown}
                className="dark-button dark-button--muted h-11 px-4"
                whileTap={{ scale: 0.95 }}
              >
                <UserCircleIcon className="w-5 h-5 text-slate-100" />
                <span className="text-sm font-medium text-slate-100 hidden sm:block">
                  {user?.firstName}
                </span>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-60 dark-panel dark-panel--surface px-1 py-1 overflow-hidden"
                  >
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                      <div className="px-4 py-3 border-b border-white/10 hover:bg-white/5 transition-colors">
                        <p className="text-sm font-semibold text-slate-50 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-slate-300/70 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </Link>

                    <div className="py-1 space-y-1">
                      <Link
                        to="/"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200/90 hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <HomeIcon className="w-4 h-4" /> Home
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200/90 hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <ChartBarIcon className="w-4 h-4" /> Dashboard
                      </Link>
                    </div>

                    <div className="py-1 mt-1 border-t border-white/10 space-y-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-200/90 hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-300 hover:bg-red-500/15 rounded-xl transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" /> Delete Account
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="dark-button dark-button--muted h-11">
                Login
              </Link>
              <Link
                to="/signup"
                className="dark-button dark-button--primary h-11"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
