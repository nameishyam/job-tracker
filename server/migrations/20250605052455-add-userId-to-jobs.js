"use strict";

module.exports = {
  async up({ context: { queryInterface, Sequelize } }) {
    await queryInterface.addColumn("Jobs", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down({ context: { queryInterface } }) {
    await queryInterface.removeColumn("Jobs", "userId");
  },
};
