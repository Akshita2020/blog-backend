"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "refreshToken");
    await queryInterface.removeColumn("Users", "refreshTokenExpiresAt");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "refreshToken", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "refreshTokenExpiresAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
