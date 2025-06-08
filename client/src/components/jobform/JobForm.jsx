import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const JobForm = ({ email, onJobAdded }) => {
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const [roundInput, setRoundInput] = useState("");

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

    const fetchUserId = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`,
          {
            params: { email },
            headers,
          },
        );
        setUserId(response.data.user.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
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

    try {
      const payload = { ...formData, userId };
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/jobs`,
        payload,
        { headers },
      );

      if (response.status === 201) {
        // Reset form
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

        // Notify parent component
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
    <div className="job-form-container">
      <form className="job-form" onSubmit={handleSubmit}>
        {/* Job Title & Company */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              name="jobtitle"
              value={formData.jobtitle}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Software Engineer"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Google"
              required
            />
          </div>
        </div>

        {/* Location & Date */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. San Francisco, CA"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date Applied</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Job Type */}
        <div className="form-group">
          <label className="form-label">Job Type</label>
          <div className="radio-group">
            {["full-time", "part-time", "intern"].map((type) => (
              <label key={type} className="radio-option">
                <input
                  type="radio"
                  name="jobtype"
                  value={type}
                  className="radio-input"
                  onChange={handleChange}
                  checked={formData.jobtype === type}
                  required
                />
                <span className="radio-label">
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div className="form-group">
          <label className="form-label">Salary</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g. $120,000 - $150,000"
            required
          />
        </div>

        {/* Interview Rounds */}
        <div className="form-group">
          <label className="form-label">Interview Rounds</label>
          <div className="rounds-input">
            <input
              type="text"
              value={roundInput}
              onChange={(e) => setRoundInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleRoundAdd())
              }
              placeholder="e.g. Technical Interview"
              className="form-input"
            />
            <button
              type="button"
              onClick={handleRoundAdd}
              className="btn btn-secondary btn-sm"
              disabled={!roundInput.trim()}
            >
              Add
            </button>
          </div>

          {formData.rounds.length > 0 && (
            <div className="rounds-list">
              {formData.rounds.map((round, index) => (
                <motion.span
                  key={index}
                  className="round-tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {round}
                  <button
                    type="button"
                    onClick={() => handleRoundRemove(index)}
                    className="round-remove"
                    aria-label="Remove round"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input form-textarea"
            placeholder="Enter job description, requirements, or additional notes..."
            rows="3"
            required
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="btn btn-primary form-submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner small"></div>
              Adding...
            </>
          ) : (
            "Add Job Application"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default JobForm;
