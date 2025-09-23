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
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "part-time":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "intern":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {job.jobtitle}
          </h1>
          {job.jobtype && (
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full self-start ${getJobTypeColor(
                job.jobtype
              )}`}
            >
              {job.jobtype.replace("-", " ")}
            </span>
          )}
        </div>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          {job.company}
        </p>
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Location
            </h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {job.location || "Not specified"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Date Applied
            </h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {formatDate(job.date)}
            </p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Salary
            </h3>
            <p className="mt-1 text-gray-900 dark:text-white">
              {job.salary || "Not specified"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Interview Rounds
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentJob.roundStatus &&
              Object.keys(currentJob.roundStatus).length > 0 ? (
                Object.keys(currentJob.roundStatus).map((round) => (
                  <label
                    key={round}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      checked={!!currentJob.roundStatus?.[round]}
                      onChange={(e) =>
                        handleCheckboxChange(round, e.target.checked)
                      }
                    />

                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        currentJob.roundStatus[round] === 1
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                      }`}
                    >
                      {round}
                    </span>
                  </label>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  None specified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {job.description && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Job Description
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
        </div>
      )}
      {currentJob.review && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Your Review
          </h3>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
              {currentJob.review}
            </p>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Add Review
        </h3>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <textarea
            value={review}
            onChange={handleReviewChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
            placeholder="Share your experience with this application..."
          />{" "}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <motion.button
              type="submit"
              disabled={isSubmitting || !review.trim()}
              whileTap={{ scale: 0.98 }}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
              className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              {isGenerating ? "Analyzing..." : "AI Analysis"}
            </motion.button>
          </div>
        </form>
      </div>
      {isGenerating && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="loading-spinner w-6 h-6"></div>
            <span className="text-gray-600 dark:text-gray-300">
              AI is analyzing your review...
            </span>
          </div>
        </div>
      )}
      {aiResponse && !isGenerating && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            AI Analysis & Next Steps
          </h3>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
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
