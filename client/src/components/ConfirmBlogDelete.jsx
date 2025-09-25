import { motion } from "framer-motion";

const ConfirmBlogDelete = ({ isOpen, blogTitle, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.16 }}
        className="bg-slate-900 rounded-2xl shadow-lg p-6 w-full max-w-sm border border-white/10"
      >
        <h2 className="text-lg font-semibold text-slate-100 mb-2">
          Confirm Delete
        </h2>

        <p className="text-slate-300 text-sm mb-4">
          Are you sure you want to delete{blogTitle ? ` "${blogTitle}"` : ""}?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmBlogDelete;
