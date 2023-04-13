const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    API: process.env.API
      ? process.env.API.split("")[process.env.API.length - 1] === "/"
        ? process.env.API.substring(0, process.env.API.length - 1)
        : process.env.API
      : "http://localhost:5000",
    BASE_PATH: process.env.BASE_PATH
      ? process.env.BASE_PATH.split("")[0] === "/"
        ? process.env.BASE_PATH.substring(1, process.env.BASE_PATH.length)
        : process.env.BASE_PATH
      : "",
    IS_TEST_MODE: process.env.IS_TEST_MODE ? process.env.IS_TEST_MODE : false,
  },
  videoCompression: process.env.VIDEO_COMPRESSION ? process.env.VIDEO_COMPRESSION : true,
});
