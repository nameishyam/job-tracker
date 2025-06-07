import { useState, useEffect } from "react";
import "./jobform.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import model from "../../utils/gemini.js";

const JobForm = ({ email, onJobAdded }) => {
  const [userId, setUserId] = useState(null);
  const { token } = useAuth();
  const [roundInput, setRoundInput] = useState("");
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

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

  const descriptionWithAi = async (text) => {
    try {
      const prompt = `Generate a detailed job description such that the user can be able to understand the status of his job using the content provided by him: ${text}. Make sure to give the response in a markdown format and using first person as if the user were you. Just generate the description, not any other content, just give the description only. Remove the 'markdown\`\`\`' and '\`\`\`' at the start and end of the response.`;
      const result = await model.generateContent(prompt);
      const aiResponse = result.response;
      const generatedText = aiResponse.text();
      console.log(`Generated description: ${generatedText}`);
      setFormData((prev) => ({
        ...prev,
        description: generatedText,
      }));
    } catch (error) {
      console.log(`error: ${error}`);
      alert("Failed to generate description with AI. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User ID not yet loaded. Please wait...");
      return;
    }
    const payload = {
      ...formData,
      userId,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };
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
    }
  };

  return (
    <div className="job-form-card">
      <form className="job-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="job-form-label">Job Title</label>
          <input
            type="text"
            name="jobtitle"
            value={formData.jobtitle}
            onChange={handleChange}
            className="job-form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="job-form-label">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="job-form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="job-form-label">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="job-form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="job-form-label">Job Type</label>
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
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="job-form-label">Salary</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="job-form-input"
            required
          />
        </div>{" "}
        <div className="form-group">
          <label className="job-form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="job-form-textarea"
            placeholder="Enter the job description as you wish"
            required
          ></textarea>
          <button
            type="button"
            onClick={() => descriptionWithAi(formData.description)}
            className="ai-rewrite-button"
            disabled={!formData.description.trim()}
          >
            ✨ Rewrite with AI
          </button>
        </div>
        <div className="form-group">
          <label className="job-form-label">Rounds</label>
          <div className="rounds-input-wrapper">
            <input
              type="text"
              value={roundInput}
              onChange={(e) => setRoundInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleRoundAdd())
              }
              placeholder="e.g. Coding Round"
              className="job-form-input"
            />
            <button
              type="button"
              onClick={handleRoundAdd}
              className="add-round-button"
            >
              Add
            </button>
          </div>
          <div className="rounds-list">
            {formData.rounds.map((round, index) => (
              <span key={index} className="round-chip">
                {round}
                <button
                  type="button"
                  onClick={() => handleRoundRemove(index)}
                  className="remove-round-button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>{" "}
        </div>
        <div className="form-group">
          <label className="job-form-label">Date Applied</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="job-form-input"
            required
          />
        </div>
        <button type="submit" className="job-form-button">
          Add Job
        </button>
      </form>
    </div>
  );
};

export default JobForm;
