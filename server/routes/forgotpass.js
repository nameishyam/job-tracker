import { sendMailServices } from "../email/sendMail.js";
import { Router } from "express";
import { hash, compare } from "bcrypt";
import db from "../models/index.js";

const router = Router();
const saltRounds = 10;
const otpStore = {};
const { User } = db;

router.post("/generate-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await hash(otp, saltRounds);
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
    const isMatch = await compare(otp, record.hashedOTP);
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
    user.password = await hash(newPassword, saltRounds);
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Password reset failed" });
  }
});

export default router;
