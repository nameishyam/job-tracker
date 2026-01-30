"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Jobs", "review", {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Jobs", "review");
}
