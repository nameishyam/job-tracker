const pgtools = require("pgtools");
require("dotenv").config();
const { URL } = require("url");
const db = require("../models");
const config = require("../config/config").production;

const dbUrl = process.env.DATABASE_URL || config.use_env_variable;

if (!dbUrl) {
  console.error("DATABASE_URL environment variable not defined.");
  process.exit(1);
}

const parsed = new URL(dbUrl);

const dbConfig = {
  user: parsed.username,
  password: parsed.password,
  host: parsed.hostname,
  port: parsed.port || 5432,
  database: parsed.pathname.replace("/", ""),
};

const ensureDatabaseExists = async () => {
  try {
    await pgtools.createdb(
      {
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: dbConfig.port,
      },
      dbConfig.database
    );
    console.log(`Database "${dbConfig.database}" created successfully.`);
  } catch (err) {
    if (err.name === "duplicate_database") {
      console.log(`Database "${dbConfig.database}" already exists.`);
    } else {
      console.error("Error creating database:", err);
      process.exit(1);
    }
  }
};

module.exports = ensureDatabaseExists;
