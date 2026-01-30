"use strict";

import { readdirSync } from "fs";
import { basename, dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import Sequelize, { DataTypes } from "sequelize";
import { env as _env } from "process";
import * as configModule from "../config/config.js";

// ESM replacements for __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = _env.NODE_ENV || "development";
const config = configModule[env] || configModule;

const db = {};

let sequelize;

const buildOptions = (cfg) => {
  const opts = { ...cfg };
  delete opts.use_env_variable;
  delete opts.url;
  return opts;
};

if (config.use_env_variable && _env[config.use_env_variable]) {
  sequelize = new Sequelize(
    _env[config.use_env_variable],
    buildOptions(config),
  );
} else if (config.url) {
  sequelize = new Sequelize(config.url, buildOptions(config));
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    buildOptions(config),
  );
}

// Load all model files dynamically (ESM way)
const files = readdirSync(__dirname).filter(
  (file) =>
    file.endsWith(".js") &&
    file !== basename(__filename) &&
    !file.endsWith(".test.js"),
);

for (const file of files) {
  const fileUrl = pathToFileURL(join(__dirname, file)).href;
  const { default: modelFactory } = await import(fileUrl);
  const model = modelFactory(sequelize, DataTypes);
  db[model.name] = model;
}

// Run associations
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
