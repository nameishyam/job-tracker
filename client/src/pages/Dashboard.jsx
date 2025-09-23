import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import { PlusIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import Prism from "../styles/Prism";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, logout } = useAuth();
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full relative prism-container">
            <Prism
              animationType="rotate"
              timeScale={0.8}
              height={3}
              baseWidth={5}
              scale={3}
              hueShift={180}
              colorFrequency={0.5}
              noise={0}
              glow={0.4}
            />
          </div>
        </div>
        <div className="loading-spinner w-8 h-8 relative z-10"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full relative prism-container">
          <Prism
            animationType="hover"
            timeScale={0.6}
            height={4}
            baseWidth={6}
            scale={3.5}
            hueShift={270}
            colorFrequency={0.8}
            noise={0.1}
            glow={0.5}
          />
          <div className="absolute inset-0 glass-overlay" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="glass-card p-6 flex-1 mr-4">
            <h1 className="text-3xl font-bold text-white mb-2">
              Job Dashboard
            </h1>
            <p className="text-white/70">
              Track and manage your job applications
            </p>
          </div>

          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileTap={{ scale: 0.95 }}
            className="mt-4 sm:mt-0 glass-button px-6 py-3 font-semibold text-white hover:scale-105 transition-all duration-300 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Job
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Add New Job
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-white/60 hover:text-white text-2xl transition-colors"
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

          <div className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"}`}>
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center">
                  <BriefcaseIcon className="w-6 h-6 text-white/80 mr-3" />
                  <h2 className="text-xl font-semibold text-white">
                    Your Applications ({jobs.length})
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {jobs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="glass-effect-subtle rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <BriefcaseIcon className="w-10 h-10 text-white/60" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-3">
                      No applications yet
                    </h3>
                    <p className="text-white/70 mb-6">
                      Start tracking your job applications by adding your first
                      one.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="glass-button px-6 py-3 font-semibold text-white hover:scale-105 transition-all duration-300 flex items-center mx-auto"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Add Your First Job
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
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
    </div>
  );
};

export default Dashboard;