require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");
const ensureDatabaseExists = require("./utils/ensureDatabase");
const runMigrations = require("./utils/runMigrations");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await ensureDatabaseExists();

    await sequelize.authenticate();
    console.log("✅ Connected to database.");

    await runMigrations(sequelize);
    console.log("✅ Migrations completed.");

    app.get("/", (req, res) => {
      res.send(
        "<h1>Job Tracker Server</h1><p>Server is running successfully!</p>"
      );
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup error:", error);
    process.exit(1);
  }
};

startServer();
