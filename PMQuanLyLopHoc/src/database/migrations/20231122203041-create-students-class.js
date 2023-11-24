'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentsClasses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.INTEGER
      },
      classId: {
        type: Sequelize.INTEGER
      },
      statusId: {
        type: Sequelize.INTEGER
      },
      completedDate: {
        type: Sequelize.DATE
      },
      dropDate: {
        type: Sequelize.DATE
      },
      recover: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StudentsClasses');
  }
};