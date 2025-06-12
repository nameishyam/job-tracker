const express = require("express");
const { User, Job } = require("./models");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const model = require("./utils/gemini");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-development";

const saltRounds = 10;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

app.post(`/users/signup`, async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const hashedPwd = await bcrypt.hash(password, saltRounds);
  try {
    const existingUser = await User.findUser({ email });
    console.log("Existing user check:", existingUser);
    if (existingUser) return res.status(400).send("User already Exists");
    const user = await User.createUser({
      firstName,
      lastName,
      email,
      password: hashedPwd,
    });
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.post(`/users/login`, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findUser({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send("Invalid password");
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/users", authenticateToken, async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Backend error:", error.message);
    return res.status(500).send("Server error");
  }
});

app.post(`/users/jobs`, authenticateToken, async (req, res) => {
  const {
    userId,
    jobtitle,
    company,
    location,
    jobtype,
    salary,
    description,
    date,
    rounds,
    review,
  } = req.body;
  try {
    const createdJob = await Job.create({
      userId,
      jobtitle,
      company,
      location,
      jobtype,
      salary,
      description,
      date,
      rounds,
      review,
    });
    return res
      .status(201)
      .json({ message: "Job created successfully", job: createdJob });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post(`/users/jobs/review`, authenticateToken, async (req, res) => {
  const { jobId, review } = req.body;
  try {
    const job = await Job.findOne({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job Not Found" });
    }
    job.review = review;
    await job.save();
    return res.status(200).json({ message: "Review added successfully", job });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.get(`/users/jobs`, authenticateToken, async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const jobs = await Job.findAll({ where: { userId: user.id } });
    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this user" });
    }
    return res.status(200).json({ jobs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.delete(`/users`, authenticateToken, async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "user not found" });
    await Job.destroy({ where: { userId } });
    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.delete(`/users/jobs`, authenticateToken, async (req, res) => {
  const { jobId } = req.body;
  try {
    const job = await Job.findOne({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    await job.destroy();
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.post("/gemini/ask", authenticateToken, async (req, res) => {
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

Provide actionable advice, next steps, and if applicable, congratulations or motivation. Format your response in markdown.`;
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

module.exports = app;
