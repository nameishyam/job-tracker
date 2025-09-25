import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-100">
      <h2 className="text-2xl font-semibold tracking-tight">
        Share Your Experience
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200/80">
            Company Name
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="glass-input"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200/80">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="glass-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200/80">Review</label>
        <textarea
          name="review"
          value={formData.review}
          onChange={handleChange}
          rows={4}
          className="glass-textarea"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200/80">
            Rating (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            placeholder="e.g. 4"
            value={formData.rating ?? ""}
            onChange={handleRatingChange}
            className="glass-input"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200/80">
            Salary
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="glass-input"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-200/80 flex items-center gap-2">
          Interview Rounds
        </label>
        {formData.rounds.length === 0 && (
          <div className="glass-panel glass-panel--tight p-4 text-slate-200/70 flex items-center justify-between">
            <span>No rounds added yet.</span>
            <button
              type="button"
              onClick={addRoundEnd}
              className="glass-button glass-button--primary px-4 py-2"
            >
              Add round
            </button>
          </div>
        )}
        <div className="space-y-3">
          {formData.rounds.map((r, i) => (
            <div
              key={i}
              className="glass-panel glass-panel--tight p-4 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <input
                type="text"
                placeholder={`Round ${i + 1} (e.g. HR, Technical)`}
                value={r}
                onChange={(e) => handleRoundChange(i, e.target.value)}
                className="glass-input flex-1"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addRoundAt(i)}
                  title="Add a round after this one"
                  className="glass-icon-btn"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeRound(i)}
                  title="Remove this round"
                  className="glass-icon-btn"
                >
                  –
                </button>
              </div>
            </div>
          ))}
        </div>
        {formData.rounds.length > 0 && (
          <button
            type="button"
            onClick={addRoundEnd}
            className="glass-button glass-button--primary px-4 py-2"
          >
            Add another round
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-400/30 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="glass-button glass-button--muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="glass-button glass-button--primary disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default NewBlog;
