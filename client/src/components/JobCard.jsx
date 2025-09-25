import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const JobCard = ({ job, onJobDeleted, onJobSelect }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useAuth();

  const handleCardClick = () => {
    onJobSelect(job);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${job.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onJobDeleted(job.id);
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getJobTypeClass = (type) => {
    const baseClass = "px-2 py-1 text-xs font-medium rounded-full";
    switch (type?.toLowerCase()) {
      case "full time":
      case "full-time":
        return `${baseClass} bg-emerald-400/20 text-emerald-300 border border-emerald-400/30`;
      case "part time":
      case "part-time":
        return `${baseClass} bg-blue-400/20 text-blue-300 border border-blue-400/30`;
      case "contract":
        return `${baseClass} bg-amber-400/20 text-amber-300 border border-amber-400/30`;
      case "internship":
        return `${baseClass} bg-purple-400/20 text-purple-300 border border-purple-400/30`;
      default:
        return `${baseClass} bg-slate-400/20 text-slate-300 border border-slate-400/30`;
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -2 }}
      className="glass-panel glass-panel--surface glass-panel--hover p-5 sm:p-6 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-50 leading-tight">
              {job.position}
            </h3>
            {job.jobType && (
              <div className={getJobTypeClass(job.jobType)}>{job.jobType}</div>
            )}
          </div>

          <h4 className="text-base sm:text-lg font-medium text-slate-200 mb-4">
            {job.company}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
            <div>
              <span className="text-slate-400 font-medium">Location:</span>
              <span className="text-slate-200 ml-2">
                {job.location || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Salary:</span>
              <span className="text-slate-200 ml-2">
                {job.salary || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Applied:</span>
              <span className="text-slate-200 ml-2">
                {formatDate(job.dateApplied)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Status:</span>
              <span className="text-slate-200 ml-2">
                {job.status || "Applied"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:ml-4">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            whileTap={{ scale: 0.95 }}
            className="glass-icon-btn"
            title="View details"
          >
            <EyeIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={handleDelete}
            disabled={isDeleting}
            whileTap={{ scale: 0.95 }}
            className="glass-icon-btn text-rose-300 hover:text-rose-200 disabled:opacity-50"
            title="Delete job"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              <TrashIcon className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
