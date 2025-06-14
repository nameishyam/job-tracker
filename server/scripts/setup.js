require("dotenv").config();
const { sequelize } = require("../models");
const ensureDatabaseExists = require("../utils/ensureDatabase");
const runMigrations = require("../utils/runMigrations");

const setupDatabase = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log("✅ Connected to database.");

    await runMigrations(sequelize);
    console.log("✅ Migrations completed.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Setup error:", error);
    process.exit(1);
  }
};

setupDatabase();
