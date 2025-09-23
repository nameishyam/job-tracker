import { useState } from "react";
import { motion } from "framer-motion";
import JobInfo from "./JobInfo";
import axios from "axios";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const JobCard = ({ job, onJobDeleted }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useAuth();

  const handleCardClick = () => {
    setIsExpanded(true);
  };

  const handleCloseModal = () => {
    setIsExpanded(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/jobs`,
        {
          data: { jobId: job.id },
          headers,
        }
      );

      if (response.status === 200) {
        if (onJobDeleted) onJobDeleted(job.id);
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

  const getJobTypeColor = (type) => {
    switch (type) {
      case "full-time":
        return "glass-badge text-green-200 border-green-400/30";
      case "part-time":
        return "glass-badge text-blue-200 border-blue-400/30";
      case "intern":
        return "glass-badge text-purple-200 border-purple-400/30";
      default:
        return "glass-badge text-white/80 border-white/20";
    }
  };

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        whileHover={{ y: -2, scale: 1.02 }}
        className="glass-card p-4 sm:p-6 cursor-pointer transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white line-clamp-2 sm:truncate">
                {job.jobtitle}
              </h3>
              {job.jobtype && (
                <span className={`px-3 py-1 text-xs font-medium rounded-full self-start ${getJobTypeColor(job.jobtype)}`}>
                  {job.jobtype.replace("-", " ")}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/80">
                <span className="font-medium text-white">Company:</span> {job.company}
              </p>
              <p className="text-sm text-white/80">
                <span className="font-medium text-white">Location:</span>{" "}
                {job.location || "Not specified"}
              </p>
              <p className="text-sm text-white/80">
                <span className="font-medium text-white">Applied:</span>{" "}
                {formatDate(job.date)}
              </p>
              {job.salary && (
                <p className="text-sm text-white/80">
                  <span className="font-medium text-white">Salary:</span> {job.salary}
                </p>
              )}
            </div>

            {job.rounds && job.rounds.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {job.rounds.slice(0, 3).map((round, index) => (
                    <span
                      key={index}
                      className="glass-badge px-3 py-1 text-xs"
                    >
                      {round}
                    </span>
                  ))}
                  {job.rounds.length > 3 && (
                    <span className="glass-badge px-3 py-1 text-xs">
                      +{job.rounds.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 sm:ml-4">
            <motion.button
              onClick={handleCardClick}
              whileTap={{ scale: 0.95 }}
              className="glass-button p-3 text-white hover:scale-110 transition-all duration-300"
              title="View details"
            >
              <EyeIcon className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={handleDelete}
              disabled={isDeleting}
              whileTap={{ scale: 0.95 }}
              className="glass-button p-3 text-red-300 hover:text-red-200 hover:scale-110 transition-all duration-300 disabled:opacity-50"
              title="Delete job"
            >
              {isDeleting ? (
                <div className="loading-spinner w-5 h-5"></div>
              ) : (
                <TrashIcon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 glass-effect-strong border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold text-white">
                Job Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-white/60 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <JobInfo job={job} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default JobCard;