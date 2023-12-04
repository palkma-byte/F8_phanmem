"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Permission, {
        through: "UserPermissions",
        foreignKey: "userId",
      });
      User.belongsToMany(models.Role, {
        through: "UserRoles",
        foreignKey: "userId",
      });
      User.belongsToMany(models.Social, {
        through: "UserSocials",
        foreignKey: "userId",
      });
      User.hasOne(models.LoginToken);
      User.belongsToMany(models.Social, {
        through: "UserSocials",
        foreignKey: "userId",
      });
      User.belongsTo(models.Type, { foreignKey: "typeId" });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      typeId: DataTypes.INTEGER,
      firstLogin: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
