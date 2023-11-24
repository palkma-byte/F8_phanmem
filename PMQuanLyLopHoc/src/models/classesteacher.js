'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassesTeacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClassesTeacher.init({
    teacherId: DataTypes.INTEGER,
    classId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ClassesTeacher',
  });
  return ClassesTeacher;
};