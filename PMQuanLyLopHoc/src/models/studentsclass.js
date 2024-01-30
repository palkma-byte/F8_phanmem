"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentsClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentsClass.belongsTo(models.LearningStatus, {
        foreignKey: "statusId",
      });
      StudentsClass.belongsTo(models.User, {
        foreignKey: "studentId",
      });
      StudentsClass.belongsTo(models.Class, {
        foreignKey: "classId",
      });
    }
  }
  StudentsClass.init(
    {
      studentId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      completedDate: DataTypes.DATE,
      dropDate: DataTypes.DATE,
      recover: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "StudentsClass",
    }
  );
  return StudentsClass;
};
