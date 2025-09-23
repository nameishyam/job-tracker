import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const JobForm = ({ email, onJobAdded }) => {
  const [userId, setUserId] = useState(null);
  const { token } = useAuth();
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
    if (!email || !token) return;
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(`${import.meta.env.VITE_API_URL}/users`, {
        params: { email },
        headers,
      })
      .then((response) => {
        setUserId(response.data.user.id);
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  }, [email, token]);

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
        `${import.meta.env.VITE_API_URL}/users/jobs`,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Job Title
        </label>
        <input
          type="text"
          name="jobtitle"
          value={formData.jobtitle}
          onChange={handleChange}
          className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
          placeholder="e.g. Software Engineer"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Company
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
          placeholder="e.g. Google"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
          placeholder="e.g. San Francisco, CA"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Job Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["full-time", "part-time", "intern"].map((type) => (
            <label key={type} className="glass-effect-subtle p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300">
              <input
                type="radio"
                name="jobtype"
                value={type}
                onChange={handleChange}
                checked={formData.jobtype === type}
                className="sr-only"
                required
              />
              <span className={`text-sm font-medium capitalize ${formData.jobtype === type ? 'text-white' : 'text-white/70'}`}>
                {type.replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Salary
        </label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
          placeholder="e.g. $120,000"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Interview Rounds
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={roundInput}
            onChange={(e) => setRoundInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleRoundAdd())
            }
            placeholder="e.g. Technical Interview"
            className="flex-1 px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
          />
          <button
            type="button"
            onClick={handleRoundAdd}
            className="glass-button px-4 py-3 hover:scale-110 transition-all duration-300"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        {formData.rounds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.rounds.map((round, index) => (
              <span
                key={index}
                className="glass-badge px-3 py-2 text-sm flex items-center"
              >
                {round}
                <button
                  type="button"
                  onClick={() => handleRoundRemove(index)}
                  className="ml-2 text-white/60 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Date Applied
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300 resize-none"
          placeholder="Job description or notes..."
          required
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 glass-button font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <div className="loading-spinner mr-2"></div>
            Adding Job...
          </>
        ) : (
          "Add Job"
        )}
      </motion.button>
    </form>
  );
};

export default JobForm;