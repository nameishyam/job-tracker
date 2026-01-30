import "dotenv/config";
import "pg";
import app from "../app.js";
import db from "../models/index.js";

const { sequelize } = db;
let dbConnected = false;

const connectDatabase = async () => {
  if (!dbConnected) {
    try {
      await sequelize.authenticate();
      console.log("Connected to database for Vercel.");
      dbConnected = true;
    } catch (error) {
      console.error("Vercel database connection failed:", error);
      throw error;
    }
  }
};

app.get("/", (req, res) => {
  res.send(
    "<h1>Career Dock Server</h1><p>Server is running successfully on the cloud!</p>",
  );
});

export default async (req, res) => {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Request handling error in Vercel function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
