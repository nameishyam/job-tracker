import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JobInfo from "./JobInfo";
import axios from "axios";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const JobCard = ({ job, onJobDeleted }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useAuth();

  const handleCardClick = () => setIsExpanded(true);
  const handleCloseModal = () => setIsExpanded(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/jobs`,
        {
          data: { jobId: job.id },
          headers,
        }
      );

      if (response.status === 200 && onJobDeleted) {
        onJobDeleted(job.id);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const getJobTypeClass = (type) => {
    switch (type) {
      case "full-time":
        return "glass-badge glass-badge--teal";
      case "part-time":
        return "glass-badge glass-badge--blue";
      case "intern":
        return "glass-badge glass-badge--purple";
      default:
        return "glass-badge glass-badge--neutral";
    }
  };

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        whileHover={{ y: -2 }}
        className="glass-panel glass-panel--surface glass-panel--hover p-5 sm:p-6 cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-100 truncate">
                {job.jobtitle}
              </h3>
              {job.jobtype && (
                <span className={getJobTypeClass(job.jobtype)}>
                  {job.jobtype.replace("-", " ")}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-200/80">
              <p>
                <span className="text-slate-100/90 font-medium">Company:</span>{" "}
                {job.company}
              </p>
              <p>
                <span className="text-slate-100/90 font-medium">Location:</span>{" "}
                {job.location || "Not specified"}
              </p>
              <p>
                <span className="text-slate-100/90 font-medium">Applied:</span>{" "}
                {formatDate(job.date)}
              </p>
              {job.salary && (
                <p>
                  <span className="text-slate-100/90 font-medium">Salary:</span>{" "}
                  {job.salary}
                </p>
              )}
            </div>

            {job.rounds && job.rounds.length > 0 && (
              <div className="glass-taglist">
                {job.rounds.slice(0, 3).map((round, index) => (
                  <span key={index} className="glass-chip">
                    {round}
                  </span>
                ))}
                {job.rounds.length > 3 && (
                  <span className="glass-chip">
                    +{job.rounds.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:ml-4">
            <motion.button
              onClick={handleCardClick}
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
              className="glass-icon-btn text-red-300 hover:text-red-200 disabled:opacity-60"
              title="Delete job"
            >
              {isDeleting ? (
                <div className="loading-spinner w-4 h-4" />
              ) : (
                <TrashIcon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel glass-panel--surface w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-xl bg-white/10">
                <h2 className="text-xl font-semibold text-slate-50">
                  Job Details
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="glass-icon-btn text-slate-200 hover:text-slate-50"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-4.5rem)]">
                <JobInfo job={job} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobCard;
