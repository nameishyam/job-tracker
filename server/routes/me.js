const express = require("express");
const { User, Job, Blogs } = require("../models");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const jobsRaw = await Job.findAll({ where: { userId: user.id } });
    const reviewsRaw = await Blogs.findAll({ where: { userId: user.id } });
    const jobs = jobsRaw.map((job) => ({
      id: job.id,
      userId: job.userId,
      jobtitle: job.jobtitle,
      company: job.company,
      location: job.location,
      jobtype: job.jobtype,
      salary: job.salary,
      description: job.description,
      dateApplied: job.date,
      review: job.review,
      roundStatus: job.roundStatus,
      updatedAt: job.updatedAt,
      status: job.status,
    }));
    const reviews = reviewsRaw.map((review) => ({
      id: review.id,
      userId: review.userId,
      company: review.company,
      review: review.review,
      rating: review.rating,
      salary: review.salary,
      rounds: review.rounds,
      role: review.role,
      updatedAt: review.updatedAt,
    }));
    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        profile_url: user.profile_url,
        resume_url: user.resume_url,
        createdAt: user.createdAt,
      },
      jobs,
      reviews,
    });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
