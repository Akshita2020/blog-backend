// require("dotenv").config();

// module.exports = {
//   development: {
//     username: "root",
//     password: "root",
//     database: "blog_db",
//     host: "127.0.0.1",
//     dialect: "mysql",
//   },
//   test: {
//     username: "root",
//     password: null,
//     database: "database_test",
//     host: "127.0.0.1",
//     dialect: "mysql",
//   },
//   production: {
//     use_env_variable: "DB_URL",
//     dialect: "mysql",
//   },
// };
module.exports = {
  development: {
    use_env_variable: "DB_URL",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
  production: {
    use_env_variable: "DB_URL",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
};