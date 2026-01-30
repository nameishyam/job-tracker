import "dotenv/config";
import "pg";
import app from "./app.js";
import setupDatabase from "./scripts/setup.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await setupDatabase();
    app.get("/", (_, res) =>
      res.send("<h1>Career Dock Server</h1><p>Server is running locally!</p>"),
    );

    app.listen(PORT, () => console.log(`Local server up at port: ${PORT}`));
  } catch (err) {
    console.error("Failed to launch local server:", err);
    process.exit(1);
  }
})();
