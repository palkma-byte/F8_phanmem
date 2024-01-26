'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Class)
    }
  }
  Comment.init({
    classId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    parentId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER,
    attachment: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};