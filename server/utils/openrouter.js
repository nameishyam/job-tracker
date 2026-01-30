import { OpenAI } from "openai";
import { config } from "dotenv";
config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_KEY,
});

async function main({ query }) {
  const completion = await openai.chat.completions.create({
    model: process.env.LLM_MODEL,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: query,
          },
        ],
      },
    ],
  });
  return completion;
}

export default main;
