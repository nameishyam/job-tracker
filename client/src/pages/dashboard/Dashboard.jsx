import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { useNavigate } from "react-router-dom";
import JobCard from "../../components/jobcard/JobCard";
import JobForm from "../../components/jobform/JobForm";
import "./dashboard.css";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const { user, token, logout } = useAuth();
  const { showDeleteModal, closeDeleteModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) return;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/jobs`, {
        params: { email: user.email },
        headers,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.jobs && response.data.jobs.length > 0) {
          setJobs(response.data.jobs);
        } else {
          console.log("No jobs found for this user.");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
      });
  }, [user, token, logout]);

  const handleJobAdded = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
  };

  const confirmDeleteAccount = async () => {
    closeDeleteModal();
    await axios
      .delete(`${import.meta.env.VITE_API_URL}/users`, {
        data: {
          userId: user.id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("User deleted successfully");
          logout();
          navigate("/");
        }
        if (response.status === 404) {
          console.error("User not found");
        }
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        alert("Error deleting account. Please try again later.");
      });
  };

  const cancelDeleteAccount = () => {
    closeDeleteModal();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Job <span className="dashboard-title-accent">Dashboard</span>
          </h1>
        </div>
        <div className="dashboard-grid">
          {" "}
          <div className="dashboard-form-section">
            <h2 className="section-title">Add New Job</h2>
            <JobForm
              email={user?.email}
              onJobAdded={handleJobAdded}
              token={token}
            />
          </div>
          <div className="dashboard-jobs-section">
            <h2 className="section-title">Your Jobs</h2>
            <div className="jobs-placeholder">
              {jobs.length === 0 ? (
                <p className="no-jobs-message">No jobs added yet.</p>
              ) : (
                jobs.map((job) => (
                  <JobCard key={job.id} job={job} token={token} />
                ))
              )}
            </div>{" "}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Account Deletion</h3>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="modal-buttons">
              <button
                onClick={confirmDeleteAccount}
                className="modal-button modal-button-confirm"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={cancelDeleteAccount}
                className="modal-button modal-button-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
