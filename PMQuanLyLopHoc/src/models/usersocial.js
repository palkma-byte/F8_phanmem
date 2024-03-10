"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSocial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserSocial.belongsTo(models.User);
    }
  }
  UserSocial.init(
    {
      userId: DataTypes.INTEGER,
      providerId: DataTypes.INTEGER,
      externalId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserSocial",
    }
  );
  return UserSocial;
};
