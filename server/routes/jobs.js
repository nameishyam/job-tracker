import { Router } from "express";
import db from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import { sendMailServices } from "../email/sendMail.js";

const router = Router();
const { Job, User } = db;

router.post(`/`, authenticateToken, async (req, res) => {
  const {
    jobtitle,
    company,
    location,
    jobtype,
    salary,
    description,
    dateApplied,
    roundStatus,
    review,
  } = req.body;
  const userId = req.user.userId;
  try {
    const createdJob = await Job.create({
      userId,
      jobtitle,
      company,
      location,
      jobtype,
      salary,
      description,
      date: dateApplied,
      review,
      roundStatus,
    });
    const jobObj = createdJob.toJSON ? createdJob.toJSON() : createdJob;
    res.status(201).json({ message: "Job created successfully", job: jobObj });
    (async () => {
      try {
        const user = await User.findOne({ where: { id: userId } });
        if (user?.email) {
          const info = await sendMailServices(
            user.email,
            "Job Added",
            `You added a job at ${company} as ${jobtitle} \n\n The further details: \n\n Location: ${location} \n\n Job Type: ${jobtype} \n\n Salary: ${salary} \n\n Description: ${description} \n\n Date of Application: ${dateApplied}`,
          );
        } else {
          console.warn(`No email found for user id ${userId}; skipping mail.`);
        }
      } catch (mailErr) {
        console.error("sendMailServices failed (non-fatal):", mailErr);
      }
    })();
  } catch (error) {
    console.error("Create job failed:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/", authenticateToken, async (req, res) => {
  const { jobId, ...updates } = req.body;
  try {
    const job = await Job.findOne({
      where: { id: jobId, userId: req.user.userId },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found or permission denied.",
      });
    }
    const allowedFields = [
      "jobtitle",
      "company",
      "location",
      "salary",
      "description",
      "review",
      "roundStatus",
      "status",
    ];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        job[field] = updates[field];
      }
    });
    await job.save();
    return res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:jobId", authenticateToken, async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findOne({
      where: {
        id: jobId,
        userId: req.user.userId,
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found or you don't have permission to delete it.",
      });
    }
    await job.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Delete job error:", error);
    return res.status(500).json({
      message: "Failed to delete job",
    });
  }
});

export default router;
