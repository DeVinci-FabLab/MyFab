const { defineConfig } = require("cypress");
const { readdirSync } = require("fs");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const plugins = readdirSync(__dirname + "/cypress/plugins/").filter(
        (file) => file.endsWith(".js")
      );

      for (const plugin of plugins) {
        const pluginFile = require(__dirname + "/cypress/plugins/" + plugin);
        try {
          pluginFile(on, config);
        } catch (error) {
          console.log(
            "plugin error : " + __dirname + " / cypress / plugins / " + plugin
          );
        }
      }
    },
  },
  env: {
    API: "http://localhost:5000/",
    BASE_PATH: process.env.BASE_PATH
      ? process.env.BASE_PATH.split("")[0] === "/"
        ? process.env.BASE_PATH
        : "/" + process.env.BASE_PATH
      : "",
    IS_TEST_MODE: process.env.IS_TEST_MODE ? "true" : "false",
    DARK_MODE_IN_TEST_MODE: process.env.DARK_MODE_IN_TEST_MODE
      ? "true"
      : "false",
    VERSION: require("./package.json").version,
  },
  video: true,
});
