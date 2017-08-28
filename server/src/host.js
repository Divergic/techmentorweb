const express = require("express");
const appConfig = require("../../config");
const server = require("./server");

var app = express();

app.use(server);

app.listen(appConfig.port, function () {
    console.log("Website (" + appConfig.configuration + ") listening on port " + appConfig.port + " for path " + __dirname);
});
