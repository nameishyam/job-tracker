require("dotenv").config();
const app = require("../app");

let dbConnected = false;
let sequelizeInstance = null;

/**
 * Lazy-require models so that importing this module does not
 * instantiate DB connections during build-time.
 */
const loadModels = () => {
  if (!sequelizeInstance) {
    // require the models module which exports { sequelize, Sequelize, ... }
    // This require should not itself try to authenticate; only instantiate.
    const models = require("../models");
    sequelizeInstance = models.sequelize;
  }
  return sequelizeInstance;
};

/**
 * Try to authenticate with retries (exponential backoff).
 * Returns true when connected, throws last error after retries fail.
 */
const connectDatabase = async ({
  retries = 3,
  initialDelayMs = 500,
  factor = 2,
} = {}) => {
  if (dbConnected && sequelizeInstance) return true;

  // If no DATABASE_URL present, fail fast
  if (!process.env.DATABASE_URL) {
    const err = new Error("DATABASE_URL not defined in environment.");
    console.error(err.message);
    throw err;
  }

  // Lazy load the models (and Sequelize instance)
  const sequelize = loadModels();

  let attempt = 0;
  let delay = initialDelayMs;
  let lastErr;

  while (attempt < retries) {
    try {
      attempt += 1;
      console.log(
        `ℹ️ Attempting DB connection (attempt ${attempt}/${retries})...`
      );
      // authenticate ensures credentials/ssl handshake are valid
      await sequelize.authenticate();
      dbConnected = true;
      console.log("✅ Connected to database.");
      return true;
    } catch (err) {
      lastErr = err;
      console.warn(
        `⚠️ DB connect attempt ${attempt} failed:`,
        err.message || err
      );
      if (attempt < retries) {
        console.log(`ℹ️ Retrying in ${delay}ms...`);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, delay));
        delay *= factor;
      }
    }
  }

  // if reached here, all attempts failed
  console.error("❌ All DB connection attempts failed.");
  throw lastErr;
};

// Provide a friendly fallback landing page when DB is unreachable
const landingHtml = (dbOk) => {
  if (dbOk) {
    return `<h1>Job Tracker Server</h1><p>Server is running successfully! Database connected.</p>`;
  }
  return `<h1>Job Tracker Server</h1>
    <p>Server is running but cannot connect to the database right now.</p>
    <p>This may be temporary — check logs or environment variables (DATABASE_URL).</p>`;
};

// Keep a simple root route for health checks / basic info
app.get("/", (req, res) => {
  if (dbConnected) {
    res.send(landingHtml(true));
  } else {
    // If DB not connected, still return a human-readable page (503)
    res.status(503).send(landingHtml(false));
  }
});

/**
 * Exported handler for Vercel and other serverless platforms.
 *
 * Behavior:
 * - Tries to connect to the DB (with retries).
 * - If connect succeeds, forwards request to your Express app.
 * - If connect fails, returns 503 with JSON error (or HTML for root).
 */
module.exports = async (req, res) => {
  try {
    // Attempt to connect; this will be skipped quickly if already connected.
    await connectDatabase();
    // If connected, forward the request to your Express app
    return app(req, res);
  } catch (error) {
    // Log full error for debugging (Vercel logs will show this)
    console.error("Request handling error: Could not connect to DB:", error);

    // For the root path, respond with friendly HTML
    if (req && req.url === "/") {
      res.status(503).send(landingHtml(false));
      return;
    }

    // For API requests, respond with JSON
    res.status(503).json({
      error: "Service Unavailable",
      message: "Unable to connect to the database. Please try again later.",
    });
  }
};
