"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExercisesSubmit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ExercisesSubmit.belongsTo(models.Class),
        ExercisesSubmit.belongsTo(models.Exercise);
    }
  }
  ExercisesSubmit.init(
    {
      studentId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      attachment: DataTypes.STRING,
      exerciseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ExercisesSubmit",
    }
  );
  return ExercisesSubmit;
};
