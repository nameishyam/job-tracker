import { Router } from "express";
import db from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import { uploadAvatar, cleanupOldAvatars } from "../uploads/profiles.js";
import { uploadResume, cleanupOldResumes } from "../uploads/resume.js";

const router = Router();
const { User, Job, Blogs } = db;

router.put(`/bio`, authenticateToken, async (req, res) => {
  const { bio } = req.body;
  const userId = req.user.userId;
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
    return res.status(200).json({ message: "Bio updated successfully", bio });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
        firstName: user.firstName,
        lastName: user.lastName,
        avatar_url: user.profile_url,
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

router.post("/resume", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const resumeFile = req.files.resume;
    const url = await uploadResume(resumeFile, userId);
    await cleanupOldResumes(userId, 5);
    const user = await User.findOne({ where: { id: userId } });
    user.resume_url = url;
    await user.save();
    return res
      .status(200)
      .json({ message: "Resume uploaded successfully", resumeUrl: url });
  } catch (error) {
    return res.status(500).json({ message: "Resume upload failed" });
  }
});

router.delete("/resume", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.resume_url = null;
    await user.save();
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete resume" });
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

export default router;
