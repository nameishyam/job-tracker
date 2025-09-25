import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import { PlusIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, logout } = useAuth();

  useEffect(() => {
    if (!token || !user) return;

    const fetchJobs = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs`,
          {
            params: { email: user.email },
            headers,
          }
        );

        if (Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
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
      <section className="page-shell flex items-center justify-center">
        <div className="glass-panel glass-panel--tight px-6 py-4 flex items-center gap-3">
          <div className="loading-spinner w-6 h-6" />
          <p className="text-sm text-slate-200/80">
            Loading your applications…
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="page-width space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="glass-panel glass-panel--surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
        >
          <div>
            <h1 className="heading-xl">Job Dashboard</h1>
            <p className="muted mt-3 max-w-2xl">
              Track every application, interview round, and insight from one
              shimmering command center.
            </p>
          </div>

          <motion.button
            onClick={() => setShowForm((prev) => !prev)}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="glass-button glass-button--primary h-11 px-6 glow-pulse"
          >
            <PlusIcon className="w-4 h-4" />{" "}
            {showForm ? "Close Form" : "Add Job"}
          </motion.button>
        </motion.div>

        <div
          className={`grid gap-6 ${
            showForm
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
              : "lg:grid-cols-1"
          }`}
        >
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="glass-panel glass-panel--surface p-6 lg:sticky lg:top-24 h-fit"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-100">
                    Add New Job
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="glass-icon-btn text-slate-300 hover:text-slate-100"
                  >
                    ×
                  </button>
                </div>
                <JobForm
                  email={user?.email}
                  onJobAdded={handleJobAdded}
                  token={token}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
            className="glass-panel glass-panel--surface overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="glass-icon-btn">
                  <BriefcaseIcon className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold text-slate-100">
                  Your Applications ({jobs.length})
                </h2>
              </div>
            </div>

            <div className="p-6">
              {jobs.length === 0 ? (
                <div className="glass-panel glass-panel--tight text-center py-14 space-y-4">
                  <BriefcaseIcon className="w-12 h-12 mx-auto text-slate-300/60" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-100">
                      No applications yet
                    </h3>
                    <p className="muted max-w-sm mx-auto">
                      Capture your first opportunity to unlock tailored progress
                      tracking and AI-powered insights.
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setShowForm(true)}
                    whileTap={{ scale: 0.96 }}
                    className="glass-button glass-button--primary h-11 px-6"
                  >
                    <PlusIcon className="w-4 h-4" /> Add your first job
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: "easeOut",
                        delay: index * 0.05,
                      }}
                    >
                      <JobCard job={job} onJobDeleted={handleJobDeleted} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
