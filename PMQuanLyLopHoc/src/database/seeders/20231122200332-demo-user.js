"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        name: "example student",
        email: "student@gmail.com",
        password: bcrypt.hashSync("1", 10),
        phone: "0321321032",
        address: "asd",
        typeId: "1",
        firstLogin: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "example teacher",
        email: "teacher@gmail.com",
        password: bcrypt.hashSync("1", 10),
        phone: "0321321032",
        address: "asd",
        typeId: "2",
        firstLogin: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "example admin Juan",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("1", 10),
        phone: "0321321032",
        address: "asd",
        typeId: "3",
        firstLogin: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
