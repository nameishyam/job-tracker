import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

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
        `${import.meta.env.VITE_API_URL}/users/jobs/review`,
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
        const generatedText = response.data.response;
        setAiResponse(generatedText);
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
        `${import.meta.env.VITE_API_URL}/users/jobs`,
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
      } else {
        console.error("Error updating round status:", response);
      }
    } catch (err) {
      console.error("Failed to update round status:", err);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/jobs`,
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

  const getJobTypeColor = (type) => {
    switch (type) {
      case "full-time":
        return "glass-badge text-green-200 border-green-400/30";
      case "part-time":
        return "glass-badge text-blue-200 border-blue-400/30";
      case "intern":
        return "glass-badge text-purple-200 border-purple-400/30";
      default:
        return "glass-badge text-white/80 border-white/20";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {job.jobtitle}
          </h1>
          {job.jobtype && (
            <span className={`px-4 py-2 text-sm font-medium rounded-full self-start ${getJobTypeColor(job.jobtype)}`}>
              {job.jobtype.replace("-", " ")}
            </span>
          )}
        </div>
        <p className="text-lg text-white/80">
          {job.company}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-effect-subtle p-4 rounded-lg">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-2">
              Location
            </h3>
            <p className="text-white">
              {job.location || "Not specified"}
            </p>
          </div>

          <div className="glass-effect-subtle p-4 rounded-lg">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-2">
              Date Applied
            </h3>
            <p className="text-white">
              {formatDate(job.date)}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-effect-subtle p-4 rounded-lg">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-2">
              Salary
            </h3>
            <p className="text-white">
              {job.salary || "Not specified"}
            </p>
          </div>

          <div className="glass-effect-subtle p-4 rounded-lg">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-2">
              Interview Rounds
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {currentJob.roundStatus &&
              Object.keys(currentJob.roundStatus).length > 0 ? (
                Object.keys(currentJob.roundStatus).map((round) => (
                  <label
                    key={round}
                    className="flex items-center space-x-3 cursor-pointer glass-effect-subtle p-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/30 text-green-400 focus:ring-green-400 bg-transparent"
                      checked={!!currentJob.roundStatus?.[round]}
                      onChange={(e) =>
                        handleCheckboxChange(round, e.target.checked)
                      }
                    />
                    <span className={`text-sm font-medium ${
                      currentJob.roundStatus[round] === 1
                        ? "text-green-200"
                        : "text-white/70"
                    }`}>
                      {round}
                    </span>
                  </label>
                ))
              ) : (
                <span className="text-white/60">
                  None specified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {job.description && (
        <div className="glass-effect-subtle p-6 rounded-lg">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">
            Job Description
          </h3>
          <div className="text-white/80 whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      )}

      {currentJob.review && (
        <div className="glass-effect-strong p-6 rounded-lg border border-green-400/30">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">
            Your Review
          </h3>
          <p className="text-white whitespace-pre-wrap">
            {currentJob.review}
          </p>
        </div>
      )}

      <div className="glass-effect-subtle p-6 rounded-lg">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">
          Add Review
        </h3>
        <form onSubmit={handleReviewSubmit} className="space-y-6">
          <textarea
            value={review}
            onChange={handleReviewChange}
            rows={4}
            className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300 resize-none"
            placeholder="Share your experience with this application..."
          />

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.button
              type="submit"
              disabled={isSubmitting || !review.trim()}
              whileTap={{ scale: 0.98 }}
              className="flex-1 sm:flex-none glass-button px-6 py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={AiReview}
              disabled={isGenerating}
              whileTap={{ scale: 0.98 }}
              className="flex-1 sm:flex-none glass-button px-6 py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isGenerating ? "Analyzing..." : "AI Analysis"}
            </motion.button>
          </div>
        </form>
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-12">
          <div className="glass-effect-subtle p-6 rounded-lg flex items-center space-x-4">
            <div className="loading-spinner w-6 h-6"></div>
            <span className="text-white">
              AI is analyzing your review...
            </span>
          </div>
        </div>
      )}

      {aiResponse && !isGenerating && (
        <div className="glass-effect-strong p-6 rounded-lg border border-purple-400/30">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">
            AI Analysis & Next Steps
          </h3>
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-white/90">
              {aiResponse}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobInfo;