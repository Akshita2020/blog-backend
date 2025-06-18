const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Blog = sequelize.define(
    "Blog",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shortDescription: {
        type: DataTypes.TEXT("tiny"),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
        allowNull: false,
      },
    },
    {
      tableName: "Blogs",
      timestamps: true,
    }
  );

  // Define associations
  Blog.associate = function (models) {
    // Blog belongs to User
    Blog.belongsTo(models.User, {
      foreignKey: "userId",
      as: "author",
    });
  };

  return Blog;
};
