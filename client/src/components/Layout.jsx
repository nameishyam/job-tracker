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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <main className="flex-1 pt-30 overflow-y-auto">
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
            className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 w-full max-w-md text-[#f1f5f9]"
          >
            <h3 className="text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Delete Account
            </h3>
            <p className="text-[#94a3b8] mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and will remove all your data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold transition"
              >
                Delete Account
              </button>
              <button
                onClick={cancelDeleteAccount}
                className="flex-1 px-4 py-2 rounded-full bg-[#334155] hover:bg-[#475569] text-[#f1f5f9] font-semibold transition"
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
