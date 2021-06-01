const express = require("express");
const app = express();
const routes = require("./routes/routes.js");

require("dotenv").config();

routes(app, express);
