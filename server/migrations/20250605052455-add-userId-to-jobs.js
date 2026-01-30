"use strict";

export async function up(queryInterface, Sequelize) {
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
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Jobs", "userId");
}
