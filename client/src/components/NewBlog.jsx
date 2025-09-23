import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const NewBlog = ({ onSuccess, onCancel }) => {
  const { user, token } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    review: "",
    rating: null,
    salary: "",
    rounds: [],
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleRatingChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      rating: value === "" ? null : Number(value),
    }));
  };

  const handleRoundChange = (index, value) => {
    setFormData((prev) => {
      const rounds = [...prev.rounds];
      rounds[index] = value;
      return { ...prev, rounds };
    });
  };

  const addRoundAt = (index) => {
    setFormData((prev) => {
      const rounds = [...prev.rounds];
      rounds.splice(index + 1, 0, "");
      return { ...prev, rounds };
    });
  };

  const addRoundEnd = () => {
    setFormData((prev) => ({ ...prev, rounds: [...prev.rounds, ""] }));
  };

  const removeRound = (index) => {
    setFormData((prev) => {
      const rounds = [...prev.rounds];
      rounds.splice(index, 1);
      return { ...prev, rounds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs`,
        {
          userId: user.id,
          company: formData.company,
          review: formData.review,
          rating: formData.rating,
          salary: formData.salary,
          rounds: formData.rounds,
          role: formData.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Blog submitted:", response.data);
      onSuccess();
    } catch (error) {
      console.log(error);
      setError("Failed to submit blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Share Your Experience
      </h2>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Company Name
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
          placeholder="e.g. Google"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Role
        </label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
          placeholder="e.g. Software Engineer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Review
        </label>
        <textarea
          name="review"
          value={formData.review}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300 resize-none"
          placeholder="Share your interview experience..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Rating (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            placeholder="e.g. 4"
            value={formData.rating ?? ""}
            onChange={handleRatingChange}
            className="w-full px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
          />
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
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-3">
          Interview Rounds
        </label>
        {formData.rounds.length === 0 && (
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm text-white/60">
              No rounds added yet.
            </p>
            <button
              type="button"
              onClick={addRoundEnd}
              className="glass-button px-4 py-2 text-sm font-medium text-white hover:scale-105 transition-all duration-300"
            >
              Add round
            </button>
          </div>
        )}
        <div className="space-y-3">
          {formData.rounds.map((r, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder={`Round ${i + 1} (e.g. HR, Technical)`}
                value={r}
                onChange={(e) => handleRoundChange(i, e.target.value)}
                className="flex-1 px-4 py-3 glass-input focus:scale-105 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => addRoundAt(i)}
                title="Add a round after this one"
                className="glass-button px-4 py-3 font-bold text-white hover:scale-110 transition-all duration-300"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeRound(i)}
                title="Remove this round"
                className="glass-button px-4 py-3 font-bold text-red-300 hover:text-red-200 hover:scale-110 transition-all duration-300"
              >
                –
              </button>
            </div>
          ))}
        </div>
        {formData.rounds.length > 0 && (
          <div className="mt-3">
            <button
              type="button"
              onClick={addRoundEnd}
              className="glass-button px-4 py-2 text-sm font-medium text-white hover:scale-105 transition-all duration-300"
            >
              Add another round
            </button>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 glass-effect-strong rounded-lg border border-red-400/30 text-red-200 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="glass-button px-6 py-3 font-semibold text-white/80 hover:text-white hover:scale-105 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="glass-button px-6 py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default NewBlog;