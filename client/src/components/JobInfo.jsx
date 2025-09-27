import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import Checkbox from "@mui/material/Checkbox";

const JobInfo = ({ job, onClose }) => {
  const [review, setReview] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentJob, setCurrentJob] = useState(job);
  const { token, user } = useAuth();

  useEffect(() => setCurrentJob(job), [job]);

  const handleReviewChange = (e) => setReview(e.target.value);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;
    setIsSubmitting(true);
    const payload = { jobId: job.id, review };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs/review`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setCurrentJob({ ...currentJob, review });
        setReview("");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const AiReview = async () => {
    try {
      setIsGenerating(true);
      setAiResponse("");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/gemini/ask`,
        { job: currentJob, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200)
        setAiResponse(response.data.response || "No response");
    } catch (error) {
      console.error("AI analysis error:", error);
      setAiResponse(
        "Sorry, I couldn't analyze your review at the moment. Please try again later."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "Not specified";

  const handleCheckboxChange = async (round, checked) => {
    try {
      const payload = { jobId: job.id, round, status: checked ? 1 : 0 };
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        if (response.data?.job) setCurrentJob(response.data.job);
        else
          setCurrentJob((prevJob) => ({
            ...prevJob,
            roundStatus: { ...prevJob.roundStatus, [round]: checked ? 1 : 0 },
          }));
      }
    } catch (err) {
      console.error("Failed to update round status:", err);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs`,
          {
            params: { email: user.email },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200 && response.data.jobs) {
          const updatedJob = response.data.jobs.find((j) => j.id === job.id);
          if (updatedJob) setCurrentJob(updatedJob);
        }
      } catch (error) {
        console.error("Failed to fetch job:", error);
      }
    };
    fetchJob();
  }, [user.email, job.id, token]);

  const getJobTypeClass = (type) => {
    switch (type) {
      case "full-time":
        return "px-2 py-1 rounded-lg bg-emerald-400/20 text-emerald-300 text-xs font-semibold";
      case "part-time":
        return "px-2 py-1 rounded-lg bg-blue-400/20 text-blue-300 text-xs font-semibold";
      case "intern":
        return "px-2 py-1 rounded-lg bg-purple-400/20 text-purple-300 text-xs font-semibold";
      default:
        return "px-2 py-1 rounded-lg bg-slate-400/20 text-slate-300 text-xs font-semibold";
    }
  };

  return (
    <div className="flex flex-col min-h-0 p-6 sm:p-8 space-y-6 text-[#f1f5f9]">
      <div className="flex items-start justify-between border-b border-white/10 pb-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {job.jobtitle || job.position || job.title}
            </h1>
            {job.jobtype && (
              <span className={getJobTypeClass(job.jobtype)}>
                {job.jobtype.replace("-", " ")}
              </span>
            )}
          </div>
          <p className="text-lg text-[#94a3b8] truncate">{job.company}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
              Location
            </h3>
            <p className="mt-2 truncate">{job.location || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
              Date Applied
            </h3>
            <p className="mt-2">{formatDate(job.date)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
              Salary
            </h3>
            <p className="mt-2">{job.salary || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
              Interview Rounds
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentJob?.roundStatus &&
              Object.keys(currentJob.roundStatus).length > 0 ? (
                Object.keys(currentJob.roundStatus).map((round) => (
                  <label
                    key={round}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/6 bg-white/3 backdrop-blur-md text-sm text-[#f1f5f9]"
                  >
                    <Checkbox
                      checked={!!currentJob.roundStatus?.[round]}
                      onChange={(e) =>
                        handleCheckboxChange(round, e.target.checked)
                      }
                      sx={{
                        color: "#4ade80",
                        "&.Mui-checked": {
                          color: "#4ade80",
                        },
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">
                          {round}
                        </span>
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <span className="text-[#94a3b8]">None specified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {job.description && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
            Job Description
          </h3>
          <div className="p-5 bg-[#0f172a] border border-white/10 rounded-lg text-[#f1f5f9] whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      )}

      {currentJob?.review && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
            Your Review
          </h3>
          <div className="p-4 bg-emerald-500/5 border border-emerald-300/20 rounded-lg text-[#f1f5f9]">
            <p className="whitespace-pre-wrap leading-relaxed">
              {currentJob.review}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
          Add Review
        </h3>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <textarea
            value={review}
            onChange={handleReviewChange}
            rows={4}
            className="w-full px-3 py-2 text-sm rounded-lg bg-[#0f172a] border border-white/10 text-[#f1f5f9] resize-none focus:outline-none focus:ring-1 focus:ring-cyan-400"
            placeholder="Share your experience with this application..."
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <motion.button
              type="submit"
              disabled={isSubmitting || !review.trim()}
              whileTap={{ scale: 0.97 }}
              className="flex-1 sm:flex-none justify-center rounded-lg px-4 py-2 bg-[#10b981] border border-[#10b981] text-[#020617] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#34d399] hover:border-[#34d399] transition flex items-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />{" "}
                  Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={AiReview}
              disabled={isGenerating}
              whileTap={{ scale: 0.97 }}
              className="flex-1 sm:flex-none justify-center rounded-lg px-4 py-2 bg-[#334155] border border-white/10 text-[#f1f5f9] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#475569] transition flex items-center gap-2"
            >
              <SparklesIcon className="w-4 h-4" />
              {isGenerating ? "Analyzing..." : "AI Analysis"}
            </motion.button>

            <div className="ml-auto text-xs text-[#94a3b8] hidden sm:block">
              Tip: Use AI to get feedback and next steps!
            </div>
          </div>
        </form>
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-8 gap-3 text-[#f1f5f9]/85">
          <div className="w-5 h-5 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
          AI is analyzing your review...
        </div>
      )}

      {aiResponse && !isGenerating && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
            AI Analysis & Next Steps
          </h3>
          <div className="p-5 bg-[#0f172a] border border-white/10 rounded-lg">
            <div className="prose prose-sm dark:prose-invert max-w-none text-[#f1f5f9]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiResponse}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobInfo;
