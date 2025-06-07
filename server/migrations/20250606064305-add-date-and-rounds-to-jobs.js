"use strict";

module.exports = {
  async up({ context: { queryInterface, Sequelize } }) {
    await queryInterface.addColumn("Jobs", "date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn("Jobs", "rounds", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  async down({ context: { queryInterface } }) {
    await queryInterface.removeColumn("Jobs", "date");
    await queryInterface.removeColumn("Jobs", "rounds");
  },
};
