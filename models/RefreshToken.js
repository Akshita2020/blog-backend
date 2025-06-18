const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RefreshToken = sequelize.define(
    "RefreshToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      refreshToken: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deviceInfo: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Device identifier or user agent info",
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: "IP address of the device",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: "Whether this token is still active",
      },
    },
    {
      tableName: "RefreshToken",
      timestamps: true,
      indexes: [
        {
          fields: ["refreshToken"],
          unique: true,
        },
        {
          fields: ["userId"],
        },
        {
          fields: ["userId", "isActive"],
        },
      ],
    }
  );

  RefreshToken.associate = function (models) {
    RefreshToken.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return RefreshToken;
};
