import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";

const Layout = () => {
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
    <div className="app-content">
      <Navbar />
      <main className="app-main pt-12">
        <Outlet />
      </main>

      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="dark-panel dark-panel--surface p-8 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-2 text-gradient">
              Delete Account
            </h3>
            <p className="muted mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and will remove all your data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDeleteAccount}
                className="dark-button dark-button--danger flex-1"
              >
                Delete Account
              </button>
              <button
                onClick={cancelDeleteAccount}
                className="dark-button dark-button--muted flex-1"
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
