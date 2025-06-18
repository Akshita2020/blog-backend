"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if columns exist before adding them
    const tableDescription = await queryInterface.describeTable("RefreshToken");

    // Add deviceInfo column if it doesn't exist
    if (!tableDescription.deviceInfo) {
      await queryInterface.addColumn("RefreshToken", "deviceInfo", {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: "Device identifier or user agent info",
      });
    }

    // Add ipAddress column if it doesn't exist
    if (!tableDescription.ipAddress) {
      await queryInterface.addColumn("RefreshToken", "ipAddress", {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: "IP address of the device",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns
    await queryInterface.removeColumn("RefreshToken", "deviceInfo");
    await queryInterface.removeColumn("RefreshToken", "ipAddress");
  },
};
