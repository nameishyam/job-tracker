import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Minus } from "lucide-react";

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
    <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-track-slate-800/20 scrollbar-thumb-slate-600/30 hover:scrollbar-thumb-slate-600/50">
      <form onSubmit={handleSubmit} className="space-y-6 text-slate-100">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Share Your Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200/85">
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="glass-input"
              placeholder="Enter company name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200/85">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="glass-input"
              placeholder="Enter role/position"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200/85">
            Review
          </label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows={4}
            className="glass-input resize-none"
            placeholder="Share your interview experience..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200/85">
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
            <label className="text-sm font-medium text-slate-200/85">
              Salary
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="glass-input"
              placeholder="e.g. 12 LPA"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-200/85">
            Interview Rounds
          </label>

          {formData.rounds.length === 0 ? (
            <div className="glass-panel glass-panel--tight p-6 text-center">
              <p className="text-slate-200/70 mb-4">No rounds added yet.</p>
              <button
                type="button"
                onClick={addRoundEnd}
                className="glass-button glass-button--primary px-4 py-2 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Round
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.rounds.map((round, index) => (
                <div
                  key={index}
                  className="glass-panel glass-panel--tight p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-200/85">
                      Round {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => addRoundAt(index)}
                        title="Add round after this one"
                        className="glass-icon-btn"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRound(index)}
                        title="Remove this round"
                        className="glass-icon-btn"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. HR Round, Technical Round, Coding Test"
                    value={round}
                    onChange={(e) => handleRoundChange(index, e.target.value)}
                    className="glass-input w-full"
                  />
                </div>
              ))}

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={addRoundEnd}
                  className="glass-button glass-button--primary px-4 py-2 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Round
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="glass-panel glass-panel--tight p-3 border border-rose-400/40 bg-rose-500/10 text-rose-200 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/30">
          <button
            type="button"
            onClick={onCancel}
            className="glass-button glass-button--muted px-6 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="glass-button glass-button--primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="loading-spinner" />
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBlog;
