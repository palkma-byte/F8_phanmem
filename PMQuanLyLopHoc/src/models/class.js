"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Class.belongsToMany(models.User, {
        through: "ClassesTeacher",
        foreignKey: "classId",
        as: "Teacher",
      });
      Class.belongsTo(models.Course);
      Class.hasMany(models.Exercise);
      Class.hasMany(models.Comment);
      Class.belongsToMany(models.User, {
        through: "StudentsClass",
        foreignKey: "classId",
        as: "Student",
      });
      Class.hasMany(models.StudentsClass, { foreignKey: "classId" });
    }
  }
  Class.init(
    {
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      schedule: DataTypes.STRING,
      timeLearn: DataTypes.TIME,
      courseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Class",
    }
  );
  return Class;
};
