"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the isActive column to the existing RefreshToken table
    await queryInterface.addColumn("RefreshToken", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: "Whether this token is still active",
    });

    // Add the composite index for userId and isActive
    await queryInterface.addIndex("RefreshToken", ["userId", "isActive"], {
      name: "refresh_token_user_active_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the index first
    await queryInterface.removeIndex(
      "RefreshToken",
      "refresh_token_user_active_idx"
    );

    // Remove the column
    await queryInterface.removeColumn("RefreshToken", "isActive");
  },
};
