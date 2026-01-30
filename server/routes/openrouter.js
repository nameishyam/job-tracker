import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import main from "../utils/openrouter.js";

const router = Router();

router.post("/ask", authenticateToken, async (req, res) => {
  const { job } = req.body;
  const rounds = {};
  const roundKeys = job.roundStatus ? Object.keys(job.roundStatus) : [];
  const roundStatuses = job.roundStatus
    ? Object.values(job.roundStatus) === 1
      ? ["finished"]
      : ["pending"]
    : [];
  roundKeys.forEach((key, index) => {
    rounds[key] = roundStatuses[index];
  });
  try {
    const prompt = `Generate a detailed analysis and next steps based on this job application review: "${
      job.review ? job.review : ""
    }" and job description: "${job.description}".
Job details for reference:
- Position: ${job.jobtitle}
- Company: ${job.company}
- Location: ${job.location}
- Type: ${job.jobtype}
- Salary: ${job.salary}
- Interview Rounds: ${
      Object.keys(rounds).length > 0
        ? Object.entries(rounds)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "None specified"
    }
Provide actionable advice, next steps, and if applicable, congratulations or motivation. Address the user directly using "you" (e.g., "you have done this," "my advice to you is..."). Do not conclude with open-ended questions inviting further conversation. Format your response in markdown. Lastly consolidate it into a strictly single paragraph content without any bolds and other syntaxes. Ensure that the response is strictly of not more than 130 words. Ensure the response is clear, concise, and free of grammatical errors. No need to give any headings and side headings in the response. just start with the content. no need to tell what you are going to do, just do it.`;
    const result = await main({ query: prompt });
    const response = result.choices[0].message.content.trim();
    return res
      .status(200)
      .json({ message: "AI analysis generated successfully", response });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }
});

export default router;
