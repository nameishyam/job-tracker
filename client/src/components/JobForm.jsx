import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const JobForm = ({ email, onJobAdded }) => {
  const [userId, setUserId] = useState(null);
  const { token, user } = useAuth();
  const [roundInput, setRoundInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userId: null,
    jobtitle: "",
    company: "",
    location: "",
    jobtype: "",
    salary: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    rounds: [],
  });

  useEffect(() => {
    if (!user) {
      alert("User not logged in. Please log in to add a job.");
      return;
    }
    setUserId(user?.id || null);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoundAdd = () => {
    const trimmed = roundInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      rounds: [...prev.rounds, trimmed],
    }));
    setRoundInput("");
  };

  const handleRoundRemove = (index) => {
    const updated = formData.rounds.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      rounds: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User ID not yet loaded. Please wait...");
      return;
    }

    setIsSubmitting(true);
    const payload = { ...formData, userId };
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs`,
        payload,
        { headers }
      );
      if (response.status === 201) {
        setFormData({
          userId: null,
          jobtitle: "",
          company: "",
          location: "",
          jobtype: "",
          salary: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          rounds: [],
        });
        setRoundInput("");
        if (onJobAdded) onJobAdded(response.data.job);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTypes = [
    { value: "full-time", label: "Full time" },
    { value: "part-time", label: "Part time" },
    { value: "intern", label: "Intern" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Job Title
        </label>
        <input
          type="text"
          name="jobtitle"
          value={formData.jobtitle}
          onChange={handleChange}
          className="glass-input"
          placeholder="e.g. Software Engineer"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Company
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="glass-input"
          placeholder="e.g. Google"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="glass-input"
          placeholder="e.g. San Francisco, CA"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Job Type
        </label>
        <div className="flex flex-wrap gap-3">
          {jobTypes.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg text-sm text-slate-200/90 transition-colors ${
                formData.jobtype === value
                  ? "ring-2 ring-cyan-400/60"
                  : "hover:border-white/25"
              }`}
            >
              <input
                type="radio"
                name="jobtype"
                value={value}
                onChange={handleChange}
                checked={formData.jobtype === value}
                className="text-emerald-400 focus:ring-emerald-400 bg-transparent border-slate-500"
                required
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Salary
        </label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="glass-input"
          placeholder="e.g. $120,000"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Interview Rounds
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={roundInput}
            onChange={(e) => setRoundInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleRoundAdd())
            }
            placeholder="e.g. Technical Interview"
            className="glass-input flex-1"
          />
          <button
            type="button"
            onClick={handleRoundAdd}
            className="glass-icon-btn text-emerald-200 hover:text-emerald-100"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        {formData.rounds.length > 0 && (
          <div className="glass-taglist mt-3">
            {formData.rounds.map((round, index) => (
              <span key={index} className="glass-chip">
                {round}
                <button
                  type="button"
                  onClick={() => handleRoundRemove(index)}
                  className="ml-2 text-emerald-200/80 hover:text-emerald-100"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Date Applied
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="glass-input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="glass-textarea resize-none"
            placeholder="Job description or notes..."
            required
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.97 }}
        className="glass-button glass-button--primary w-full h-12 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-3">
            <div className="loading-spinner w-4 h-4" />
            Adding Job...
          </span>
        ) : (
          "Add Job"
        )}
      </motion.button>
    </form>
  );
};

export default JobForm;
