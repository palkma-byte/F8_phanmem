'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LearningStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LearningStatus.hasMany(models.StudentsClass, { foreignKey: "statusId" });
    }
  }
  LearningStatus.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LearningStatus',
  });
  return LearningStatus;
};