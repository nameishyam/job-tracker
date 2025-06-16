import { useState } from "react";
import { motion } from "framer-motion";
import JobInfo from "../jobinfo/JobInfo";
import axios from "axios";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

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
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "part-time":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "intern":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  return (
    <>
      {" "}
      <motion.div
        onClick={handleCardClick}
        whileHover={{ y: -2 }}
        className="p-3 sm:p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 sm:truncate">
                {job.jobtitle}
              </h3>
              {job.jobtype && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full self-start ${getJobTypeColor(
                    job.jobtype
                  )}`}
                >
                  {job.jobtype.replace("-", " ")}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Company:</span> {job.company}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Location:</span>{" "}
                {job.location || "Not specified"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Applied:</span>{" "}
                {formatDate(job.date)}
              </p>
              {job.salary && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Salary:</span> {job.salary}
                </p>
              )}
            </div>

            {job.rounds && job.rounds.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {job.rounds.slice(0, 3).map((round, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded"
                    >
                      {round}
                    </span>
                  ))}
                  {job.rounds.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded">
                      +{job.rounds.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>{" "}
          <div className="flex items-center space-x-2 sm:ml-4">
            <motion.button
              onClick={handleCardClick}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="View details"
            >
              <EyeIcon className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={handleDelete}
              disabled={isDeleting}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Job Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
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
