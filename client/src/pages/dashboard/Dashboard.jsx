import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import JobCard from "../../components/jobcard/JobCard";
import JobForm from "../../components/jobform/JobForm";
import "./dashboard.css";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const { user, token, logout } = useAuth();

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
