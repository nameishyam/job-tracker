const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Job, Blogs } = require("../models");
const { authenticateToken } = require("../middleware/auth");
const { sendMailServices } = require("../email/sendMail");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-development";
const saltRounds = 10;

router.post(`/signup`, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findUser({ email });
    if (existingUser) return res.status(400).send("User already Exists");
    const hashedPwd = await bcrypt.hash(password, saltRounds);
    const user = await User.createUser({
      firstName,
      lastName,
      email,
      password: hashedPwd,
    });
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });
    const info = await sendMailServices(
      email,
      "Welcome to Job Tracker!",
      `Hello ${firstName},\n\nThank you for signing up for Job Tracker! We're excited to have you on board.\n\nBest regards,\nSyam Gowtham 😊`
    );
    return res.status(201).json({
      message: "User created successfully",
      user,
      token,
      info,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post(`/login`, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUser({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send("Invalid password");
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post(`/generate-otp`, async (req, res) => {
  const { email, otp } = req.body;
  try {
    const info = await sendMailServices(
      email,
      "Your OTP Code",
      `Your OTP is: ${otp}`
    );
    return res.status(200).json({ message: "OTP sent successfully", info });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.patch(`/reset-password`, async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.put(`/bio`, authenticateToken, async (req, res) => {
  const { userId, bio } = req.body;
  if (req.user.userId !== userId) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only update your own bio." });
  }
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.bio = bio;
    await user.save();
    return res.status(200).json({ message: "Bio updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
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

router.get(`/:id`, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete(`/`, authenticateToken, async (req, res) => {
  const { userId } = req.body;
  if (req.user.userId !== userId) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only delete your own account." });
  }
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });
    await Job.destroy({ where: { userId } });
    await Blogs.destroy({ where: { userId } });
    await user.destroy();
    return res
      .status(200)
      .json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
