const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Job, Blogs } = require("../models");
const { authenticateToken } = require("../middleware/auth");
const { sendMailServices } = require("../email/sendMail");
const {
  uploadAvatar,
  getAvatarUrl,
  cleanupOldAvatars,
} = require("../uploads/profiles");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-development";
const saltRounds = 10;

const otpStore = {};

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findUser({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    sendMailServices(
      email,
      "Welcome to Career Dock!",
      `Hello ${firstName},\n\nWelcome to Career Dock.\nWe're excited to have you onboard!\n\n— Syam Gowtham`
    ).catch((err) => {
      console.error("Email failed:", err.message);
    });

    return res.status(201).json({
      message: "Signup successful",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findUser({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById({ id: req.user.userId });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        profile_url: user.profile_url,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.cookie("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
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

router.post("/avatar", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const avatarFile = req.files.avatar;
    const url = await uploadAvatar(avatarFile, userId);
    await cleanupOldAvatars(userId, 5);
    const user = await User.findOne({ where: { id: userId } });
    user.profile_url = url;
    await user.save();
    return res
      .status(200)
      .json({ message: "Avatar uploaded successfully", avatarUrl: url });
  } catch (error) {
    return res.status(500).json({ message: "Avatar upload failed" });
  }
});

router.delete("/avatar", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profile_url = null;
    await user.save();
    return res.status(200).json({ message: "Avatar deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete avatar" });
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Job.destroy({ where: { userId } });
    await Blogs.destroy({ where: { userId } });
    await user.destroy();

    res.cookie("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return res.status(200).json({
      message: "Account and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Failed to delete account" });
  }
});

module.exports = router;
