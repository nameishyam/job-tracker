import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "../../components/jobcard/JobCard";
import JobForm from "../../components/jobform/JobForm";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuth();
  const { showDeleteModal, closeDeleteModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) return;

    const fetchJobs = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/jobs`,
          {
            params: { email: user.email },
            headers,
          },
        );

        if (response.data.jobs && response.data.jobs.length > 0) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, token, logout]);

  const handleJobAdded = (newJob) => {
    setJobs((prevJobs) => [newJob, ...prevJobs]);
  };

  const confirmDeleteAccount = async () => {
    closeDeleteModal();
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          data: { userId: user.id },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        logout();
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again later.");
    }
  };

  const cancelDeleteAccount = () => {
    closeDeleteModal();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="dashboard-title">Job Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage and track all your job applications in one place
          </p>
        </motion.div>

        <div className="dashboard-grid">
          {/* Add Job Form Section */}
          <motion.div
            className="dashboard-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="section-header">
              <h2 className="section-title">Add New Job</h2>
              <p className="section-subtitle">Track a new job application</p>
            </div>
            <JobForm
              email={user?.email}
              onJobAdded={handleJobAdded}
              token={token}
            />
          </motion.div>

          {/* Jobs List Section */}
          <motion.div
            className="dashboard-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="section-header">
              <h2 className="section-title">Your Jobs</h2>
              <p className="section-subtitle">
                {jobs.length === 0
                  ? "No applications yet"
                  : `${jobs.length} applications`}
              </p>
            </div>

            <div className="jobs-container">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading your jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No jobs added yet</h3>
                  <p>
                    Start by adding your first job application using the form on
                    the left.
                  </p>
                </div>
              ) : (
                <motion.div
                  className="jobs-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence>
                    {jobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <JobCard job={job} token={token} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="modal-title">Delete Account</h3>
              <p className="modal-message">
                Are you sure you want to delete your account? This action cannot
                be undone and all your data will be permanently removed.
              </p>
              <div className="modal-actions">
                <button
                  onClick={confirmDeleteAccount}
                  className="btn btn-danger"
                >
                  Delete Account
                </button>
                <button
                  onClick={cancelDeleteAccount}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
