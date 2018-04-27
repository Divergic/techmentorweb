const express = require("express");
const server = require("./server");
const monitor = require("./monitor");
const serverConfig = require("./serverConfig");

monitor();

var app = express();

app.use(server(serverConfig));

app.listen(serverConfig.port, function () {
    console.log("Website (" + serverConfig.configuration + ") listening on port " + serverConfig.port + " for path " + __dirname);
});