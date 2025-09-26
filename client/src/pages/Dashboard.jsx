import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import JobInfo from "../components/JobInfo";
import {
  PlusIcon,
  BriefcaseIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user, token, logout, jobs, storeJobs } = useAuth();

  useEffect(() => {
    if (!token || !user) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchJobs = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs`,
          {
            params: { email: user.email },
            headers,
            signal: controller.signal,
          }
        );
        if (
          Array.isArray(response.data.jobs) &&
          typeof storeJobs === "function"
        ) {
          storeJobs(response.data.jobs);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Dashboard fetchJobs error:", error);
        if ([401, 403].includes(error.response?.status)) logout();
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
    return () => controller.abort();
  }, [user, token, logout, storeJobs]);

  const handleJobAdded = (newJob) => {
    storeJobs?.((prevJobs) => [...(prevJobs || []), newJob]);
    setShowForm(false);
  };

  const handleJobDeleted = (deletedJobId) => {
    storeJobs?.((prevJobs) =>
      (prevJobs || []).filter((job) => job.id !== deletedJobId)
    );
  };

  const handleJobSelect = (job) => setSelectedJob(job);
  const handleCloseJobDetail = () => setSelectedJob(null);

  if (isLoading)
    return (
      <section className="page-shell flex items-center justify-center">
        <div className="dark-panel p-4 flex items-center gap-2 text-sm">
          <div className="loading-spinner w-5 h-5" />
          Loading your applications…
        </div>
      </section>
    );

  return (
    <>
      <section className="page-shell">
        <div className="page-width space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="dark-panel p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-100">
                Job Dashboard
              </h1>
              <p className="text-sm text-slate-300 max-w-md mt-1">
                Track your applications, interviews, and insights from one
                place.
              </p>
            </div>

            <motion.button
              onClick={() => setShowForm((prev) => !prev)}
              whileTap={{ scale: 0.95 }}
              className="dark-button dark-button--primary h-9 px-4 flex items-center gap-1 text-sm"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              {showForm ? "Close Form" : "Add Job"}
            </motion.button>
          </motion.div>

          {/* Main Grid */}
          <div
            className={`grid gap-4 ${
              showForm
                ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
                : "lg:grid-cols-1"
            }`}
          >
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3 }}
                  className="dark-panel p-4 lg:sticky lg:top-20 h-fit"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-100">
                      Add New Job
                    </h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="dark-icon-btn text-slate-300 hover:text-slate-100"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <JobForm
                    email={user?.email}
                    token={token}
                    onJobAdded={handleJobAdded}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Jobs List */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="dark-panel overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="dark-icon-btn p-2">
                    <BriefcaseIcon className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-md font-semibold text-slate-100">
                    Your Applications ({jobs.length})
                  </h2>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {jobs.length === 0 ? (
                  <div className="dark-panel p-6 text-center space-y-3">
                    <BriefcaseIcon className="w-10 h-10 mx-auto text-slate-300/60" />
                    <h3 className="text-md font-semibold text-slate-100">
                      No applications yet
                    </h3>
                    <p className="text-sm text-slate-300 max-w-xs mx-auto">
                      Add your first job to start tracking applications and
                      interviews.
                    </p>
                    <motion.button
                      onClick={() => setShowForm(true)}
                      whileTap={{ scale: 0.95 }}
                      className="dark-button dark-button--primary h-8 px-4 flex items-center gap-1 text-sm mx-auto"
                    >
                      <PlusIcon className="w-3.5 h-3.5" /> Add Job
                    </motion.button>
                  </div>
                ) : (
                  jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <JobCard
                        job={job}
                        onJobDeleted={handleJobDeleted}
                        onJobSelect={handleJobSelect}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/30 bg-slate-900/70 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-50">
                  Job Details
                </h2>
                <button
                  onClick={handleCloseJobDetail}
                  className="dark-icon-btn text-slate-200 hover:text-slate-50"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <JobInfo job={selectedJob} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
