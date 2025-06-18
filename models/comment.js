"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Blogs",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "Comments",
    timestamps: true,
  }
);

// Define associations
Comment.associate = function (models) {
  // Comment belongs to Blog
  Comment.belongsTo(models.Blog, {
    foreignKey: "postId",
    as: "post",
  });

  // Comment belongs to User
  Comment.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};

module.exports = Comment;
