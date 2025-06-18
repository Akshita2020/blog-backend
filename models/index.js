"use strict";

const Sequelize = require("sequelize");
const process = require("process");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Import models
const User = require("./Users")(sequelize);
const Blog = require("./Blogs")(sequelize);
const RefreshToken = require("./RefreshToken")(sequelize);

// Create models object
const models = {
  User,
  Blog,
  RefreshToken,
};

// Call associate methods - THIS IS THE KEY PART
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Test database connection and sync
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync();
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

// Export sequelize instance and models
module.exports = {
  sequelize,
  User,
  Blog,
  RefreshToken,
  syncDatabase,
};
