"use strict";

require("dotenv").config(); // Load environment variables

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const settingsData = [
      {
        optKey: "FACEBOOK_APP_ID",
        optValue: process.env.FACEBOOK_APP_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "FACEBOOK_APP_SECRET",
        optValue: process.env.FACEBOOK_APP_SECRET,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "GITHUB_APP_ID",
        optValue: process.env.GITHUB_APP_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "GITHUB_APP_SECRET",
        optValue: process.env.GITHUB_APP_SECRET,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "GOOGLE_APP_ID",
        optValue: process.env.GOOGLE_APP_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "GOOGLE_APP_SECRET",
        optValue: process.env.GOOGLE_APP_SECRET,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "GOOGLE_URL_CALLBACK",
        optValue: process.env.GOOGLE_URL_CALLBACK,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "FACEBOOK_URL_CALLBACK",
        optValue: process.env.FACEBOOK_URL_CALLBACK,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "GITHUB_URL_CALLBACK",
        optValue: process.env.GITHUB_URL_CALLBACK,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "BCRYPT_SALT_ROUND",
        optValue: process.env.BCRYPT_SALT_ROUND,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "MAIL_HOST",
        optValue: process.env.MAIL_HOST,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "MAIL_USERNAME",
        optValue: process.env.MAIL_USERNAME,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "MAIL_PASSWORD",
        optValue: process.env.MAIL_PASSWORD,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "MAIL_PORT",
        optValue: process.env.MAIL_PORT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "MAIL_SECURE",
        optValue: process.env.MAIL_SECURE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "MAIL_FROM",
        optValue: process.env.MAIL_FROM,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "MAIL_FROM_NAME",
        optValue: process.env.MAIL_FROM_NAME,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        optKey: "JWT_SECRET",
        optValue: process.env.JWT_SECRET,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Settings", settingsData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Settings", null, {});
  },
};
