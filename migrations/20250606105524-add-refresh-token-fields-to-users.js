"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if columns exist before adding them
    const tableDescription = await queryInterface.describeTable("Users");

    if (!tableDescription.refreshToken) {
      await queryInterface.addColumn("Users", "refreshToken", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    if (!tableDescription.refreshTokenExpiresAt) {
      await queryInterface.addColumn("Users", "refreshTokenExpiresAt", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    // Add index for better performance
    try {
      await queryInterface.addIndex("Users", ["refreshToken"], {
        name: "users_refresh_token_index",
      });
    } catch (error) {
      console.log("Index might already exist:", error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Users", "users_refresh_token_index");
    await queryInterface.removeColumn("Users", "refreshToken");
    await queryInterface.removeColumn("Users", "refreshTokenExpiresAt");
  },
};
