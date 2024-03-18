"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Exercise.belongsTo(models.Class);
      Exercise.hasMany(models.ExercisesSubmit, { as: "Submit" });
    }
  }
  Exercise.init(
    {
      classId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      attachment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Exercise",
    }
  );
  return Exercise;
};
