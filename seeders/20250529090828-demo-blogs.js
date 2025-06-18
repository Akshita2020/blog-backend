"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Blogs",
      [
        {
          userId: 1,
          title: "Getting Started with React.js",
          shortDescription:
            "Learn the basics of React.js and build your first component",
          description:
            "React.js is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we will explore the fundamentals of React, including components, props, state management, and hooks. You will learn how to create reusable components and build dynamic web applications.",
          image:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          title: "Node.js Best Practices for 2024",
          shortDescription:
            "Essential Node.js practices every developer should know",
          description:
            "Node.js continues to evolve, and staying up-to-date with best practices is crucial for building scalable applications. This article covers security, performance optimization, error handling, and modern development patterns that will make your Node.js applications robust and maintainable.",
          image:
            "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          title: "CSS Grid vs Flexbox: When to Use What",
          shortDescription:
            "Understanding the differences and use cases for CSS Grid and Flexbox",
          description:
            "CSS Grid and Flexbox are both powerful layout systems, but they serve different purposes. This detailed comparison will help you understand when to use each one, with practical examples and real-world scenarios to guide your decision-making process.",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 4,
          title: "Database Design Fundamentals",
          shortDescription:
            "Learn how to design efficient and scalable databases",
          description:
            "Good database design is the foundation of any successful application. This guide covers normalization, indexing, relationships, and performance considerations. Whether you are working with SQL or NoSQL databases, these principles will help you create efficient data structures.",
          image:
            "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 5,
          title: "JavaScript ES2024 New Features",
          shortDescription:
            "Explore the latest JavaScript features and improvements",
          description:
            "JavaScript continues to evolve with new features that make development more efficient and enjoyable. This article explores the latest ES2024 features, including new array methods, improved async/await patterns, and enhanced object manipulation capabilities.",
          image:
            "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 6,
          title: "Building RESTful APIs with Express.js",
          shortDescription: "Complete guide to creating robust REST APIs",
          description:
            "Learn how to build professional RESTful APIs using Express.js. This comprehensive tutorial covers routing, middleware, authentication, error handling, and API documentation. You will also learn about testing your APIs and deploying them to production.",
          image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 7,
          title: "Docker for Web Developers",
          shortDescription: "Containerize your web applications with Docker",
          description:
            "Docker has revolutionized how we deploy and manage applications. This guide teaches web developers how to containerize their applications, create efficient Dockerfiles, manage multi-container applications with Docker Compose, and deploy to production environments.",
          image:
            "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 8,
          title: "Vue.js 3 Composition API Deep Dive",
          shortDescription:
            "Master the Vue.js 3 Composition API with practical examples",
          description:
            "The Vue.js 3 Composition API offers a new way to organize and reuse component logic. This in-depth tutorial explores reactive references, computed properties, lifecycle hooks, and custom composables. Learn how to migrate from the Options API and write more maintainable Vue applications.",
          image:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 9,
          title: "Web Security Best Practices",
          shortDescription:
            "Protect your web applications from common security threats",
          description:
            "Web security is more important than ever. This comprehensive guide covers common vulnerabilities like XSS, CSRF, SQL injection, and how to prevent them. Learn about authentication, authorization, HTTPS, content security policies, and other essential security measures.",
          image:
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 10,
          title: "GraphQL vs REST: Making the Right Choice",
          shortDescription:
            "Compare GraphQL and REST to choose the best API approach",
          description:
            "Choosing between GraphQL and REST can be challenging. This detailed comparison examines the strengths and weaknesses of each approach, performance considerations, tooling, and real-world use cases to help you make an informed decision for your next project.",
          image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Blogs", null, {});
  },
};
