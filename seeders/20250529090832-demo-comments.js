"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Comments",
      [
        {
          postId: 1,
          userId: 2,
          comment:
            "Great introduction to React! This really helped me understand the basics.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 1,
          userId: 3,
          comment:
            "Thanks for the clear explanations. Looking forward to more React tutorials.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 2,
          userId: 1,
          comment:
            "These Node.js practices are exactly what I needed for my current project.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 2,
          userId: 4,
          comment:
            "Excellent article! The security tips are particularly valuable.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 3,
          userId: 5,
          comment:
            "Finally understand when to use Grid vs Flexbox. Very helpful comparison!",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 4,
          userId: 6,
          comment:
            "Database design can be tricky, but this guide makes it much clearer.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 5,
          userId: 7,
          comment:
            "Love the new ES2024 features! Can't wait to use them in production.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 6,
          userId: 8,
          comment:
            "This Express.js tutorial is comprehensive and well-structured.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 7,
          userId: 9,
          comment:
            "Docker was intimidating before, but this guide makes it approachable.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 8,
          userId: 10,
          comment:
            "Vue 3 Composition API is powerful. Thanks for the detailed examples!",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Comments", null, {});
  },
};
