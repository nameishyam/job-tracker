const express = require("express");
const { Blogs } = require("../models");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const blogs = await Blogs.findAll();
    return res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get(`/user`, authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogs = await Blogs.findAll({ where: { userId } });
    return res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post(`/`, authenticateToken, async (req, res) => {
  const { company, review, rating, salary, rounds, role } = req.body;
  const userId = req.user.userId;
  try {
    const blog = await Blogs.create({
      userId,
      company,
      review,
      rating,
      salary,
      rounds,
      role,
    });
    return res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
