import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import { motion } from "framer-motion";
import { SparklesIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import Checkbox from "@mui/material/Checkbox";

const JobInfo = ({ job, onClose }) => {
  const { token, user } = useAuth();
  const [currentJob, setCurrentJob] = useState(job);
  const [draftJob, setDraftJob] = useState(job);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
          if (updatedJob) {
            setCurrentJob(updatedJob);
            if (!editMode) setDraftJob(updatedJob);
          }
        }
      } catch (error) {
        console.error("Failed to fetch job:", error);
      }
    };
    fetchJob();
  }, [user.email, job.id, token, editMode]);

  const handleInputChange = (field, value) => {
    setDraftJob((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoundChange = async (round, checked) => {
    setDraftJob((prev) => ({
      ...prev,
      roundStatus: { ...prev.roundStatus, [round]: checked ? 1 : 0 },
    }));

    try {
      const payload = { jobId: currentJob.id, round, status: checked ? 1 : 0 };
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200 && response.data.job) {
        setCurrentJob(response.data.job);
        setDraftJob(response.data.job);
      }
    } catch (err) {
      console.error("Failed to update round status:", err);
    }
  };

  const handleJobUpdate = async () => {
    try {
      setIsSubmitting(true);
      const payload = { jobId: currentJob.id };
      const editableFields = [
        "jobtitle",
        "company",
        "salary",
        "location",
        "description",
        "review",
      ];
      editableFields.forEach((field) => {
        if (draftJob[field] !== currentJob[field]) {
          payload[field] = draftJob[field];
        }
      });
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200 && response.data.job) {
        setCurrentJob(response.data.job);
        setDraftJob(response.data.job);
        setEditMode(false);
      }
    } catch (err) {
      console.error("Failed to update job:", err);
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
        { job: currentJob, review: draftJob.review },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    <div className="flex flex-col min-h-0 p-6 sm:p-8 space-y-6 text-[#f1f5f9] relative">
      <div className="relative border-b border-white/10 pb-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-3">
            {editMode ? (
              <input
                type="text"
                value={draftJob.jobtitle || ""}
                onChange={(e) => handleInputChange("jobtitle", e.target.value)}
                className="px-2 py-1 rounded bg-[#0f172a] border border-white/10 text-[#f1f5f9] text-2xl font-semibold"
              />
            ) : (
              <h1 className="text-2xl font-semibold tracking-tight truncate">
                {currentJob.jobtitle || currentJob.position || currentJob.title}
              </h1>
            )}
            {job.jobtype && (
              <span className={getJobTypeClass(job.jobtype)}>
                {job.jobtype.replace("-", " ")}
              </span>
            )}
          </div>
          {editMode ? (
            <input
              type="text"
              value={draftJob.company || ""}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="mt-1 text-lg text-[#94a3b8] w-full px-2 py-1 rounded bg-[#0f172a] border border-white/10"
            />
          ) : (
            <p className="text-lg text-[#94a3b8] truncate">
              {currentJob.company}
            </p>
          )}
        </div>

        <motion.button
          onClick={() => setEditMode(!editMode)}
          whileTap={{ scale: 0.95 }}
          className="absolute top-0 right-0 mt-2 mr-2 inline-flex items-center justify-center rounded-full h-9 px-4 font-semibold text-sm border border-emerald-500 bg-emerald-500 text-slate-900 transition hover:bg-emerald-400 hover:border-emerald-400"
        >
          <PencilIcon className="w-5 h-5 text-slate-900" />
          {editMode ? "Editing" : "Edit Job"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
              Location
            </h3>
            {editMode ? (
              <input
                type="text"
                value={draftJob.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="mt-2 w-full px-2 py-1 rounded bg-[#0f172a] border border-white/10 text-[#f1f5f9]"
              />
            ) : (
              <p className="mt-2 truncate">
                {currentJob.location || "Not specified"}
              </p>
            )}
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
              Date Applied
            </h3>
            <p className="mt-2">{formatDate(currentJob.date)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
              Salary
            </h3>
            {editMode ? (
              <input
                type="text"
                value={draftJob.salary || ""}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                className="mt-2 w-full px-2 py-1 rounded bg-[#0f172a] border border-white/10 text-[#f1f5f9]"
              />
            ) : (
              <p className="mt-2">{currentJob.salary || "Not specified"}</p>
            )}
          </div>

          <div className="space-y-2 mt-2">
            <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
              Interview Rounds
            </h3>

            {editMode && (
              <div className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  placeholder="Add new round..."
                  value={draftJob.newRound || ""}
                  onChange={(e) =>
                    setDraftJob((prev) => ({
                      ...prev,
                      newRound: e.target.value,
                    }))
                  }
                  className="flex-1 px-2 py-1 rounded bg-[#0f172a] border border-white/10 text-[#f1f5f9] text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!draftJob.newRound) return;
                    setDraftJob((prev) => ({
                      ...prev,
                      roundStatus: {
                        ...prev.roundStatus,
                        [prev.newRound]: 0,
                      },
                      newRound: "",
                    }));
                  }}
                  className="px-2 py-1 bg-[#10b981] text-[#020617] rounded-lg text-sm hover:bg-[#34d399] transition"
                >
                  Add
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {Object.keys(draftJob.roundStatus || {}).map((round) =>
                editMode ? (
                  <label
                    key={round}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 bg-white/3 text-xs text-[#f1f5f9]"
                  >
                    <Checkbox
                      checked={draftJob.roundStatus[round] === 1}
                      onChange={(e) =>
                        handleRoundChange(round, e.target.checked)
                      }
                      sx={{
                        width: 16,
                        height: 16,
                        color:
                          draftJob.roundStatus[round] === 1
                            ? "#4ade80"
                            : "#facc15",
                        "&.Mui-checked": { color: "#4ade80" },
                      }}
                    />
                    {round}
                  </label>
                ) : (
                  <span
                    key={round}
                    className={`px-2 py-1 rounded text-xs ${
                      draftJob.roundStatus[round] === 1
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {round}
                  </span>
                )
              )}
              {(!draftJob.roundStatus ||
                Object.keys(draftJob.roundStatus).length === 0) && (
                <span className="text-[#94a3b8] text-xs">
                  No rounds specified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {currentJob.description && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
            Job Description
          </h3>
          {editMode ? (
            <textarea
              value={draftJob.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-5 bg-[#0f172a] border border-white/10 rounded-lg text-[#f1f5f9]"
            />
          ) : (
            <div className="p-5 bg-[#0f172a] border border-white/10 rounded-lg text-[#f1f5f9] whitespace-pre-wrap">
              {currentJob.description}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
          Review
        </h3>
        {editMode ? (
          <textarea
            value={draftJob.review || ""}
            onChange={(e) => handleInputChange("review", e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-[#0f172a] border border-white/10 text-[#f1f5f9]"
            placeholder="Add your review..."
          />
        ) : currentJob.review ? (
          <div className="p-4 bg-emerald-500/5 border border-emerald-300/20 rounded-lg text-[#f1f5f9]">
            <p className="whitespace-pre-wrap leading-relaxed">
              {currentJob.review}
            </p>
          </div>
        ) : (
          <span className="text-[#94a3b8]">No review added</span>
        )}
      </div>

      {editMode && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <motion.button
            onClick={handleJobUpdate}
            disabled={isSubmitting}
            whileTap={{ scale: 0.97 }}
            className="flex-1 sm:flex-none justify-center rounded-lg px-4 py-2 bg-[#10b981] border border-[#10b981] text-[#020617] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#34d399] hover:border-[#34d399] transition flex items-center"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setEditMode(false)}
            className="flex-1 sm:flex-none justify-center rounded-lg px-4 py-2 bg-[#334155] border border-white/10 text-[#f1f5f9] hover:bg-[#475569] transition flex items-center"
          >
            Cancel
          </motion.button>
        </div>
      )}

      <div className="flex mt-2">
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
        {isGenerating && (
          <div className="flex items-center justify-center py-4 gap-3 text-[#f1f5f9]/85">
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
    </div>
  );
};

export default JobInfo;
