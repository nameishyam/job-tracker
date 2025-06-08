import { motion } from "framer-motion";

const JobInfo = ({ job }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("interview")) return "status-interview";
    if (statusLower.includes("offer")) return "status-offer";
    if (statusLower.includes("reject")) return "status-rejected";
    return "status-applied";
  };

  return (
    <div className="job-info">
      {/* Header */}
      <div className="job-info-header">
        <div className="job-info-title">
          <h2 className="job-info-role">{job.jobtitle}</h2>
          <p className="job-info-company">{job.company}</p>
        </div>
      </div>

      {/* Main Details */}
      <div className="job-info-content">
        <div className="info-section">
          <h3 className="section-title">Job Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Location</span>
              <span className="info-value">
                {job.location || "Not specified"}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Job Type</span>
              <span className="info-value">
                {job.jobtype?.charAt(0).toUpperCase() +
                  job.jobtype?.slice(1).replace("-", " ") || "Not specified"}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Date Applied</span>
              <span className="info-value">{formatDate(job.date)}</span>
            </div>

            {job.salary && (
              <div className="info-item">
                <span className="info-label">Salary</span>
                <span className="info-value salary">{job.salary}</span>
              </div>
            )}
          </div>
        </div>

        {/* Interview Rounds */}
        {job.rounds && job.rounds.length > 0 && (
          <div className="info-section">
            <h3 className="section-title">Interview Rounds</h3>
            <div className="rounds-container">
              {job.rounds.map((round, index) => (
                <motion.div
                  key={index}
                  className="round-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="round-number">{index + 1}</div>
                  <div className="round-content">
                    <span className="round-name">{round}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {job.description && (
          <div className="info-section">
            <h3 className="section-title">Description</h3>
            <div className="description-content">
              <p className="job-description">{job.description}</p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        {job.review && (
          <div className="info-section">
            <h3 className="section-title">Review</h3>
            <div className="review-content">
              <p className="job-review">{job.review}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobInfo;
