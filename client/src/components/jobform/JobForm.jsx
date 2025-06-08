import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Job Title
        </label>
        <input
          type="text"
          name="jobtitle"
          value={formData.jobtitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
          placeholder="e.g. Software Engineer"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Company
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
          placeholder="e.g. Google"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
          placeholder="e.g. San Francisco, CA"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Job Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["full-time", "part-time", "intern"].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="jobtype"
                value={type}
                onChange={handleChange}
                checked={formData.jobtype === type}
                className="text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600"
                required
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-200 capitalize">
                {type.replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Salary
        </label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
          placeholder="e.g. $120,000"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
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
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
          />
          <button
            type="button"
            onClick={handleRoundAdd}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        {formData.rounds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.rounds.map((round, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full"
              >
                {round}
                <button
                  type="button"
                  onClick={() => handleRoundRemove(index)}
                  className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Date Applied
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm resize-none"
          placeholder="Job description or notes..."
          required
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
