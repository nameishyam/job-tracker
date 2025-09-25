const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const model = require("../utils/gemini");

const router = express.Router();

router.post("/ask", authenticateToken, async (req, res) => {
  const { job, review } = req.body;
  try {
    const prompt = `Generate a detailed analysis and next steps based on this job application review: "${review}" and job description: "${
      job.description
    }".
Job details for reference:
- Position: ${job.jobtitle}
- Company: ${job.company}
- Location: ${job.location}
- Type: ${job.jobtype}
- Salary: ${job.salary}
- Interview Rounds: ${job.rounds?.join(", ") || "None specified"}
Provide actionable advice, next steps, and if applicable, congratulations or motivation. Address the user directly using "you" (e.g., "you have done this," "my advice to you is..."). Do not conclude with open-ended questions inviting further conversation. Format your response in markdown.`;
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    return res
      .status(200)
      .json({ message: "AI analysis generated successfully", response });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
