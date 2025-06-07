require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "root",
    logging: console.log,
    database: "job-tracker-dev",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "root",
    database: "job-tracker-test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
