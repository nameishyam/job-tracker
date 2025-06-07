import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./jobinfo.css";

const JobInfo = ({ job }) => {
  return (
    <div className="job-info-container">
      <h2 className="job-info-title">{job.jobtitle}</h2>
      <div className="job-info-details">
        <div className="job-info-row">
          <strong>Company:</strong> {job.company}
        </div>
        <div className="job-info-row">
          <strong>Location:</strong> {job.location || "Not specified"}
        </div>
        <div className="job-info-row">
          <strong>Date Applied:</strong> {job.date || "Not specified"}
        </div>
        <div className="job-info-row">
          <strong>Job Type:</strong> {job.jobtype || "Not specified"}
        </div>
        <div className="job-info-row">
          <strong>Salary:</strong> {job.salary || "Not specified"}
        </div>
        <div className="job-info-section">
          <strong>Rounds:</strong>
          <div className="job-info-rounds">
            {job.rounds && job.rounds.length > 0 ? (
              job.rounds.map((round, index) => (
                <span key={index} className="job-round">
                  {round}
                </span>
              ))
            ) : (
              <span className="job-round">Not specified</span>
            )}
          </div>
        </div>{" "}
        {job.description && (
          <div className="job-info-section">
            <strong>Description:</strong>
            <div className="job-description">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {job.description}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobInfo;
