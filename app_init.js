const express = require("express");
const cors = require("cors");
// const fs = require("fs");
// const cron = require("node-cron");

//importing the module routes
const moduleRoutes = require('./routes').moduleRoutes
//importing the routers of the different modules
const homeRoutes = require('./home')
const favPhasesRoutes = require('./favPhases')

const app = express();

app.use(cors());
app.use(express.json());

app.use(moduleRoutes.home, homeRoutes)
app.use(moduleRoutes.favPhases, favPhasesRoutes)

module.exports = app;