"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StudentsClasses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studentId: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      classId: {
        type: Sequelize.INTEGER,
        references: { model: "Classes", key: "id" },
        onDelete: "CASCADE",
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: { model: "LearningStatuses", key: "id" },
        defaultValue: 1,
        onDelete: "CASCADE",
      },
      completedDate: {
        type: Sequelize.DATE,
      },
      dropDate: {
        type: Sequelize.DATE,
      },
      recover: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("StudentsClasses");
  },
};
