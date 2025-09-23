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
    <div className={`min-h-screen ${isDark ? "dark" : ""} transition-theme`}>
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
            className="glass-modal p-8 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              Delete Account
            </h3>
            <p className="text-white/80 mb-8">
              Are you sure you want to delete your account? This action cannot
              be undone and will remove all your data.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 glass-button py-3 font-semibold text-red-300 hover:text-red-200 hover:scale-105 transition-all duration-300"
              >
                Delete Account
              </button>
              <button
                onClick={cancelDeleteAccount}
                className="flex-1 glass-button py-3 font-semibold text-white hover:scale-105 transition-all duration-300"
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