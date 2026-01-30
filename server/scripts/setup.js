import "dotenv/config";
import db from "../models/index.js";
import ensureDatabaseExists from "../utils/ensureDatabase.js";
import runMigrations from "../utils/runMigrations.js";
import { fileURLToPath } from "url";

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
const { sequelize } = db;

const setupDatabase = async () => {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  console.log("Connected to database.");

  await runMigrations(sequelize);
  console.log("Migrations completed.");
};

export default setupDatabase;

if (isMain) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Setup error:", err);
      process.exit(1);
    });
}
