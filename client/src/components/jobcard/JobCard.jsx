import { useState } from "react";
import "./jobcard.css";
import JobInfo from "../jobinfo/JobInfo";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/AuthContext";

const JobCard = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token } = useAuth();

  const handleCardClick = () => {
    setIsExpanded(true);
  };

  const handleCloseModal = () => {
    setIsExpanded(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .delete(`${import.meta.env.VITE_API_URL}/users/jobs`, {
          data: { jobId: job.id },
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("Job deleted successfully");
            window.location.reload();
          } else {
            console.error("Failed to delete job");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="job-card" onClick={handleCardClick}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(e);
          }}
        >
          <DeleteIcon />
        </button>
        <h3 className="job-title">{job.jobtitle}</h3>
        <p>
          <strong>Company:</strong> {job.company}
        </p>
        <p>
          <strong>Location:</strong> {job.location || "Not specified"}
        </p>
      </div>

      {isExpanded && (
        <div className="job-modal-overlay" onClick={handleCloseModal}>
          <div
            className="job-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="job-modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <JobInfo job={job} />
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;
