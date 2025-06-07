const { Umzug, SequelizeStorage } = require("umzug");

const runMigrations = (sequelize) => {
  const umzug = new Umzug({
    migrations: {
      glob: "migrations/*.js",
    },
    context: {
      queryInterface: sequelize.getQueryInterface(),
      Sequelize: sequelize.constructor,
    },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  return umzug.up();
};

module.exports = runMigrations;
