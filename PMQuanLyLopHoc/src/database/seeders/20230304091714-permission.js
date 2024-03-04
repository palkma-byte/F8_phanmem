"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Permissions", [
      {
        values: "read",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        values: "create",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        values: "update",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        values: "delete",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Permissions", null, {});
  },
};
