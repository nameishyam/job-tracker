import { motion } from "framer-motion";

const ConfirmJobDelete = ({ isOpen, jobTitle, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.16 }}
    >
      <div className="bg-[#0f172a] rounded-2xl shadow-lg p-6 w-full max-w-sm border border-white/10">
        <h2 className="text-lg font-semibold text-[#f1f5f9] mb-2">
          Confirm Delete
        </h2>

        <p className="text-[#94a3b8] text-sm mb-4">
          Are you sure you want to delete{jobTitle ? ` "${jobTitle}"` : ""}?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#334155] hover:bg-[#475569] text-[#f1f5f9] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#ef4444] hover:bg-[#f87171] text-white transition"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmJobDelete;
