"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("LearningStatuses", [
      {
        name: "Đang theo học",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hoàn thành",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tạm nghỉ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("LearningStatuses", null, {});
  },
};
