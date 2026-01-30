"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Jobs", "date", {
    type: Sequelize.DATEONLY,
    allowNull: true,
  });
  await queryInterface.addColumn("Jobs", "rounds", {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Jobs", "date");
  await queryInterface.removeColumn("Jobs", "rounds");
}
