import { Router } from "express";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import db from "../models/index.js";
import { sendMailServices } from "../email/sendMail.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-development";
const saltRounds = 10;
const { User } = db;
const { sign } = jwt;

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
    const hashedPassword = await hash(password, saltRounds);
    const user = await User.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    sendMailServices(
      email,
      "Welcome to Career Dock!",
      `Hello ${firstName},\n\nWelcome to Career Dock.\nWe're excited to have you onboard!\n\n— Syam Gowtham`,
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
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json({
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
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

export default router;
