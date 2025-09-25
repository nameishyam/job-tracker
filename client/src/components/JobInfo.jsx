import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { SparklesIcon } from "@heroicons/react/24/outline";

const JobInfo = ({ job }) => {
  const [review, setReview] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentJob, setCurrentJob] = useState(job);
  const { token, user } = useAuth();

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    setIsSubmitting(true);
    const payload = {
      jobId: job.id,
      review: review,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs/review`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setCurrentJob({ ...currentJob, review: review });
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
        {
          job: currentJob,
          review,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setAiResponse(response.data.response);
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      setAiResponse(
        "Sorry, I couldn't analyze your review at the moment. Please try again later."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const handleCheckboxChange = async (round, checked) => {
    try {
      const payload = {
        jobId: job.id,
        round,
        status: checked ? 1 : 0,
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        if (response.data?.job) {
          setCurrentJob(response.data.job);
        } else {
          setCurrentJob((prevJob) => ({
            ...prevJob,
            roundStatus: {
              ...prevJob.roundStatus,
              [round]: checked ? 1 : 0,
            },
          }));
        }
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
        return "glass-badge glass-badge--teal";
      case "part-time":
        return "glass-badge glass-badge--blue";
      case "intern":
        return "glass-badge glass-badge--purple";
      default:
        return "glass-badge glass-badge--neutral";
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 text-slate-100">
      <div className="border-b border-white/10 pb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {job.jobtitle}
          </h1>
          {job.jobtype && (
            <span className={getJobTypeClass(job.jobtype)}>
              {job.jobtype.replace("-", " ")}
            </span>
          )}
        </div>
        <p className="text-lg text-slate-200/85">{job.company}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Location
            </h3>
            <p className="mt-2 text-slate-100">
              {job.location || "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Date Applied
            </h3>
            <p className="mt-2 text-slate-100">{formatDate(job.date)}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Salary
            </h3>
            <p className="mt-2 text-slate-100">
              {job.salary || "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Interview Rounds
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {currentJob.roundStatus &&
              Object.keys(currentJob.roundStatus).length > 0 ? (
                Object.keys(currentJob.roundStatus).map((round) => (
                  <label
                    key={round}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-sm text-slate-200/85"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-500 text-emerald-400 focus:ring-emerald-400"
                      checked={!!currentJob.roundStatus?.[round]}
                      onChange={(e) =>
                        handleCheckboxChange(round, e.target.checked)
                      }
                    />
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        currentJob.roundStatus[round] === 1
                          ? "bg-emerald-500/10 text-emerald-200"
                          : "bg-red-500/10 text-red-200"
                      }`}
                    >
                      {round}
                    </span>
                  </label>
                ))
              ) : (
                <span className="text-slate-400">None specified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {job.description && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Job Description
          </h3>
          <div className="glass-panel glass-panel--tight p-5 text-slate-200 whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      )}

      {currentJob.review && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Your Review
          </h3>
          <div className="glass-panel glass-panel--tight border border-emerald-300/20 bg-emerald-500/5 text-slate-100">
            <p className="whitespace-pre-wrap leading-relaxed">
              {currentJob.review}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
          Add Review
        </h3>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <textarea
            value={review}
            onChange={handleReviewChange}
            rows={4}
            className="glass-textarea resize-none"
            placeholder="Share your experience with this application..."
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              type="submit"
              disabled={isSubmitting || !review.trim()}
              whileTap={{ scale: 0.97 }}
              className="glass-button glass-button--primary flex-1 sm:flex-none justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="loading-spinner w-4 h-4" /> Submitting...
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
              className="glass-button glass-button--muted flex-1 sm:flex-none justify-center"
            >
              <SparklesIcon className="w-4 h-4" />
              {isGenerating ? "Analyzing..." : "AI Analysis"}
            </motion.button>
          </div>
        </form>
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-8 gap-3 text-slate-200/85">
          <div className="loading-spinner w-5 h-5" />
          AI is analyzing your review...
        </div>
      )}

      {aiResponse && !isGenerating && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            AI Analysis & Next Steps
          </h3>
          <div className="glass-panel glass-panel--tight">
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-100">
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
