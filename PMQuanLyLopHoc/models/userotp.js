'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserOtp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserOtp.init({
    otp: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    expires: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserOtp',
  });
  return UserOtp;
};