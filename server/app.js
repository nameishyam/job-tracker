import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import forgotPassRoutes from "./routes/forgotpass.js";
import userRoutes from "./routes/users.js";
import jobRoutes from "./routes/jobs.js";
import reviewRoutes from "./routes/reviews.js";
import openrouterRoutes from "./routes/openrouter.js";

const app = express();

const allowedOrigins = [
  "https://career-dock.vercel.app",
  "https://career-dock.onrender.com",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    useTempFiles: false,
  }),
);

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.send("<h1>Job Tracker API</h1><p>API server is running.</p>");
});

app.use("/api/auth", authRoutes);
app.use("/api/forgot-password", forgotPassRoutes);
app.use("/api/me", meRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/openrouter", openrouterRoutes);

export default app;
