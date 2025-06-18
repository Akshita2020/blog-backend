const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Users",
      timestamps: true,
    }
  );

  User.associate = function (models) {
    // User has many blogs
    User.hasMany(models.Blog, {
      foreignKey: "userId",
      as: "blogs",
    });


    // User has many refresh tokens
    User.hasMany(models.RefreshToken, {
      foreignKey: "userId",
      as: "refreshTokens",
      onDelete: "CASCADE", 
    });
  };

  return User;
};
