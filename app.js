const compression = require("compression");
const express = require("express");
const jwt = require("./services/jwt");
const upload = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");
var session = require("express-session");
const passport = require("passport");
const stuff = require("./services/jwt.js");
const employee_api = require("./controllers/employee_api.js");
const web_api = require("./controllers/web_api");
const recruitee_api = require("./controllers/recruitee_api.js");
const mobile_api = require("./controllers/mobile_api.js");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.SERVER_PORT || 8000;

const app = express();

app.use(compression());
app.use(cors({ origin: "*" }));

app.use(morgan("dev"));
app.use(upload());

app.use(
  express.json({
    limit: "10mb",
    extended: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

jwt(app);

app.use(employee_api);
app.use(recruitee_api);
app.use(web_api);
app.use(mobile_api);

app.listen(PORT, function () {
  console.log("connected " + "localhost:8000");
});
module.exports = app;
