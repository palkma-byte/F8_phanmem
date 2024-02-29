"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StudentsAttendances", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dateLearning: {
        type: Sequelize.DATE,
      },
      studentId: {
        type: Sequelize.INTEGER,

        references: { model: "Users", key: "id" },
      },

      classId: {
        type: Sequelize.INTEGER,
        references: { model: "Classes", key: "id" },
      },
      status: {
        type: Sequelize.TINYINT,
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
    await queryInterface.dropTable("StudentsAttendances");
  },
};
