const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressHeader = require("express-header");
const session = require("express-session");
const fs = require("fs");
const app = express();
require("dotenv").config();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});
app.io = io;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SPECIALTOKEN,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 1000 * 60 * 60 },
  })
);
app.use(express.static("public"));
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: __dirname + "\\tmp\\",
  })
);
app.use(
  expressHeader([
    {
      key: "Access-Control-Allow-Origin",
      value: "*",
    },
    {
      key: "Access-Control-Allow-Methods",
      value: "GET, POST, PUT, DELETE",
    },
    {
      key: "Access-Control-Allow-Headers",
      value:
        "Origin, Content-Type, X-Auth-Token, dvflCookie, Authorization, specialCode",
    },
  ])
);

if (process.env.SHOWSWAGGER === "true") {
  const swaggerUI = require("swagger-ui-express");
  const swaggerJsDoc = require("swagger-jsdoc");
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "DeVinci FabLab API",
        version: require("./package.json").version,
        description:
          "Hello and welcome to the API documentation of the DeVinci FabLab Association website.\n" +
          "If you are not a developer of the site or a member of the association, you have nothing to do on this page (I know you will stay anyway). Congratulations for finding this page by the way.\n",
      },
      servers: [
        {
          url: process.env.API + "/api/",
        },
      ],
    },
    apis: ["./api/*.js", "./api/*/*.js", "./api/*/*/*.js"],
  };

  const specs = swaggerJsDoc(options);

  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

require("./functions/apiActions").startApi(app);
require("./functions/socket-io").connection(app);

//prepare folders
require("./functions/prepareFolders").prepareFolders();

async function start() {
  app.db = await require("./functions/dataBase/createConnection").open();
  app.executeQuery = require("./functions/dataBase/executeQuery").run;

  const port = 5000;
  server.listen(port);
  console.log();
  console.log("Server is now listening port " + port);
  if (process.env.SHOWSWAGGER === "true")
    console.log(
      "Swagger documentation available here : " + process.env.API + "/api-docs"
    );

  fs.readdirSync(__dirname + "/functions/cron/").forEach(async (file) => {
    const cron = require(__dirname + "/functions/cron/" + file);
    cron.run(app);
  });
}

start();

module.exports.closeServer = () => {
  app.db.end();
  server.close();
  process.exit(0);
};
