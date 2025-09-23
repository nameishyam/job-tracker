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
      onSuccess(); // Signal success to the parent component
    } catch (error) {
      console.log(error);
      setError("Failed to submit blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Share Your Experience
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Company Name
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Role
        </label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Review
        </label>
        <textarea
          name="review"
          value={formData.review}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Rating (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            placeholder="e.g. 4"
            value={formData.rating ?? ""}
            onChange={handleRatingChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
          />
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
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Interview Rounds
        </label>
        {formData.rounds.length === 0 && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No rounds added yet.
            </p>
            <button
              type="button"
              onClick={addRoundEnd}
              className="ml-2 inline-flex items-center px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Add round
            </button>
          </div>
        )}
        <div className="space-y-2 mt-2">
          {formData.rounds.map((r, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder={`Round ${i + 1} (e.g. HR, Technical)`}
                value={r}
                onChange={(e) => handleRoundChange(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => addRoundAt(i)}
                title="Add a round after this one"
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeRound(i)}
                title="Remove this round"
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                –
              </button>
            </div>
          ))}
        </div>
        {formData.rounds.length > 0 && (
          <div className="mt-2">
            <button
              type="button"
              onClick={addRoundEnd}
              className="inline-flex items-center px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Add another round
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default NewBlog;
