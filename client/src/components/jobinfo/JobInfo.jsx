import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import axios from "axios";
import "./jobinfo.css";
import model from "../../utils/gemini.js";

const JobInfo = ({ job }) => {
  const [review, setReview] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJob, setCurrentJob] = useState(job);

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      jobId: job.id,
      review: review,
    };
    await axios
      .post(`${import.meta.env.VITE_API_URL}/users/jobs/review`, payload)
      .then((response) => {
        if (response.status === 200) {
          setCurrentJob({ ...currentJob, review: review });
          setReview("");
        }
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };
  const AiReview = async (text) => {
    try {
      setIsGenerating(true);
      setAiResponse("");
      const prompt = `Generate a detailed furthur steps and things that i have to do from now on based on the review: ${review} and the job description: ${
        job.description
      }. And these are the job details for your reference: ${JSON.stringify(
        currentJob,
        null,
        2
      )}. at the end of your response congratulate the user if he or she has successfully achieved the job, else if they lost at any stage, provide motivation to go furthur in an emotional way. Give your response in a markdown format only. just give the response no need to address me at the start or any other things at the start or end. remove "markdown\`\`\`" and "\`\`\`" from the start and end of the response.`;
      const result = await model.generateContent(prompt);
      const aiResponse = result.response;
      const generatedText = aiResponse.text();
      setAiResponse(generatedText);
    } catch (error) {
      console.log(`error: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="job-info-container">
      <h2 className="job-info-title">{job.jobtitle}</h2>
      <div className="job-info-details">
        <div className="job-info-row">
          <strong>Company:</strong> {job.company}
        </div>
        <div className="job-info-row">
          <strong>Location:</strong> {job.location || "Not specified"}
        </div>
        <div className="job-info-row">
          <strong>Date Applied:</strong> {job.date || "Not specified"}
        </div>
        <div className="job-info-row">
          <strong>Job Type:</strong> {job.jobtype || "Not specified"}
        </div>
        <div className="job-info-row">
          <strong>Salary:</strong> {job.salary || "Not specified"}
        </div>
        <div className="job-info-section">
          <strong>Rounds:</strong>
          <div className="job-info-rounds">
            {job.rounds && job.rounds.length > 0 ? (
              job.rounds.map((round, index) => (
                <span key={index} className="job-round">
                  {round}
                </span>
              ))
            ) : (
              <span className="job-round">Not specified</span>
            )}
          </div>
        </div>{" "}
        {job.description && (
          <div className="job-info-section">
            <strong>Description:</strong>
            <div className="job-description">{job.description}</div>
          </div>
        )}{" "}
        {currentJob.review && (
          <div className="job-info-section">
            <strong>Your Review:</strong>
            <div className="job-review-display">{currentJob.review}</div>
          </div>
        )}
        <div className="job-info-section">
          <form onSubmit={handleReviewSubmit}>
            <textarea
              className="job-review-textarea"
              placeholder="Write your review here..."
              value={review}
              onChange={handleReviewChange}
              rows="4"
            ></textarea>
            <div className="job-review-buttons">
              <button type="submit" className="job-review-submit">
                Submit Review
              </button>
              <button
                type="button"
                className="ai-analyze-button"
                onClick={() => AiReview(review)}
                disabled={isGenerating || !review.trim()}
              >
                {isGenerating ? "Analyzing..." : "Analyze with AI"}
              </button>
            </div>
          </form>
          {isGenerating && (
            <div className="ai-loading">
              <div className="loading-spinner"></div>
              <span>AI is analyzing your review...</span>
            </div>
          )}
          {aiResponse && !isGenerating && (
            <div className="ai-response-section">
              <strong>AI Analysis & Next Steps:</strong>
              <div className="ai-response-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aiResponse}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobInfo;
