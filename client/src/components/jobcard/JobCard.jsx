import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import JobInfo from "../jobinfo/JobInfo";

const JobCard = ({ job }) => {
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

    if (!confirm("Are you sure you want to delete this job application?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/jobs`,
        {
          data: { jobId: job.id },
          headers,
        },
      );

      if (response.status === 200) {
        window.location.reload(); // Temporary solution - ideally would update state
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("interview")) return "status-interview";
    if (statusLower.includes("offer")) return "status-offer";
    if (statusLower.includes("reject")) return "status-rejected";
    return "status-applied";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <motion.div
        className="job-card"
        onClick={handleCardClick}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="job-card-header">
          <div className="job-basic-info">
            <h3 className="job-title">{job.jobtitle}</h3>
            <p className="job-company">{job.company}</p>
          </div>

          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete job"
          >
            {isDeleting ? <div className="loading-spinner small"></div> : "🗑️"}
          </button>
        </div>

        <div className="job-card-body">
          <div className="job-details">
            <div className="job-detail">
              <span className="detail-label">Location</span>
              <span className="detail-value">
                {job.location || "Not specified"}
              </span>
            </div>

            <div className="job-detail">
              <span className="detail-label">Type</span>
              <span className="detail-value">
                {job.jobtype?.charAt(0).toUpperCase() +
                  job.jobtype?.slice(1).replace("-", " ") || "Not specified"}
              </span>
            </div>

            <div className="job-detail">
              <span className="detail-label">Applied</span>
              <span className="detail-value">{formatDate(job.date)}</span>
            </div>
          </div>

          {job.salary && (
            <div className="job-salary">
              <span className="salary-label">Salary</span>
              <span className="salary-value">{job.salary}</span>
            </div>
          )}

          {job.rounds && job.rounds.length > 0 && (
            <div className="job-rounds">
              <span className="rounds-label">
                {job.rounds.length} Interview Round
                {job.rounds.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="job-card-footer">
          <span className="view-details">Click to view details →</span>
        </div>
      </motion.div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="job-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="job-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="job-modal-close"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ×
              </button>
              <JobInfo job={job} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobCard;
