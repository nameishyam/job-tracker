import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";

const Layout = () => {
  const { isDark } = useTheme();
  const { showDeleteModal, closeDeleteModal } = useModal();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const confirmDeleteAccount = async () => {
    closeDeleteModal();
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users`, {
        data: { userId: user?.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again later.");
    }
  };

  const cancelDeleteAccount = () => {
    closeDeleteModal();
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "dark bg-gray-900" : "bg-gray-50"
      } transition-theme`}
    >
      <Navbar />
      <Outlet />

      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Account
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and will remove all your data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
              <button
                onClick={cancelDeleteAccount}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Layout;
