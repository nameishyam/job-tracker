import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import JobCard from "../../components/jobcard/JobCard";
import JobForm from "../../components/jobform/JobForm";
import { PlusIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
          }
        );

        if (response.data.jobs && response.data.jobs.length > 0) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.log(error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [user, token, logout]);

  const handleJobAdded = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
    setShowForm(false);
  };

  const handleJobDeleted = (deletedJobId) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== deletedJobId));
  };

  const confirmDeleteAccount = async () => {
    closeDeleteModal();
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users`, {
        data: { userId: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again later.");
    }
  };

  const cancelDeleteAccount = () => {
    closeDeleteModal();
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-theme">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-gray-900 transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Job Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Track and manage your job applications
            </p>
          </div>

          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileTap={{ scale: 0.95 }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Job
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Add New Job
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
                <JobForm
                  email={user?.email}
                  onJobAdded={handleJobAdded}
                  token={token}
                />
              </div>
            </motion.div>
          )}

          {/* Jobs List */}
          <div className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <BriefcaseIcon className="w-5 h-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Applications ({jobs.length})
                  </h2>
                </div>
              </div>

              <div className="p-4">
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <BriefcaseIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No applications yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Start tracking your job applications by adding your first
                      one.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Your First Job
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <JobCard
                          job={job}
                          token={token}
                          onJobDeleted={handleJobDeleted}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Account
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and will remove all your data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
              <button
                onClick={cancelDeleteAccount}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
