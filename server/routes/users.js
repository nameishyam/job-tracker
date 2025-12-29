const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Job, Blogs } = require("../models");
const { authenticateToken } = require("../middleware/auth");
const { sendMailServices } = require("../email/sendMail");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-development";
const saltRounds = 10;

const otpStore = {};

router.post("/signup", async (req, res) => {
  try {
    console.log("[POST] /signup - body:", req.body);
    const { firstName, lastName, email, password } = req.body || {};
    if (!firstName || !lastName || !email || !password) {
      console.warn("Missing required fields", {
        firstName,
        lastName,
        email,
        password,
      });
      return res.status(400).json({ error: "Missing required fields" });
    }
    let existingUser;
    try {
      existingUser = await User.findUser({ email });
    } catch (dbErr) {
      console.error("DB findUser error:", dbErr);
      return res
        .status(500)
        .json({ error: "Database error (findUser)", detail: dbErr.message });
    }
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    if (typeof saltRounds === "undefined") {
      console.error("saltRounds is undefined");
      return res
        .status(500)
        .json({ error: "Server config error: saltRounds not set" });
    }
    let hashedPwd;
    try {
      hashedPwd = await bcrypt.hash(password, saltRounds);
    } catch (hashErr) {
      console.error("bcrypt.hash error:", hashErr);
      return res
        .status(500)
        .json({ error: "Password hashing failed", detail: hashErr.message });
    }
    let user;
    try {
      user = await User.createUser({
        firstName,
        lastName,
        email,
        password: hashedPwd,
      });
    } catch (createErr) {
      console.error("User.createUser error:", createErr);
      return res.status(500).json({
        error: "Database error (createUser)",
        detail: createErr.message,
      });
    }
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res
        .status(500)
        .json({ error: "Server config error: JWT_SECRET not set" });
    }
    let token;
    try {
      token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "24h",
      });
    } catch (jwtErr) {
      console.error("jwt.sign error:", jwtErr);
      return res
        .status(500)
        .json({ error: "Token creation failed", detail: jwtErr.message });
    }
    let info = null;
    try {
      info = await sendMailServices(
        email,
        "Welcome to Job Tracker!",
        `Hello ${firstName},\n\nThank you for signing up for Job Tracker! We're excited to have you on board.\n\nBest regards,\nSyam Gowtham 😊`
      );
    } catch (mailErr) {
      console.error("sendMailServices error:", mailErr);
      return res.status(201).json({
        message: "User created but email failed",
        user,
        token,
        mailError: mailErr.message,
      });
    }
    return res.status(201).json({
      message: "User created successfully",
      user,
      token,
      info,
    });
  } catch (error) {
    console.error("Unexpected server error in /signup:", error);
    console.error(error.stack);
    return res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
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

router.post("/generate-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    otpStore[email] = { hashedOTP, expires: Date.now() + 5 * 60 * 1000 };
    await sendMailServices(email, "Your OTP Code", `Your OTP is: ${otp}`);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/validate-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = otpStore[email];
    if (!record)
      return res.status(400).json({ message: "No OTP found for this email" });
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }
    const isMatch = await bcrypt.compare(otp, record.hashedOTP);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });
    delete otpStore[email];
    return res.status(200).json({ message: "OTP validated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "OTP validation failed" });
  }
});

router.patch("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Password reset failed" });
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
