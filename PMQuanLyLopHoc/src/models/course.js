"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.hasMany(models.Class, { foreignKey: "courseId" });
      Course.hasMany(models.CourseModule, {
        foreignKey: "courseId",
        as: "Module",
      });
    }
  }
  Course.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      tryLearn: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
