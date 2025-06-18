"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password123", 10);

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "John Doe",
          email: "john.doe@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sarah Wilson",
          email: "sarah.wilson@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "David Brown",
          email: "david.brown@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Emily Davis",
          email: "emily.davis@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Chris Miller",
          email: "chris.miller@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Lisa Garcia",
          email: "lisa.garcia@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Robert Taylor",
          email: "robert.taylor@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Amanda Martinez",
          email: "amanda.martinez@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
