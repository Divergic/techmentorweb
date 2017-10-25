const express = require("express");
const server = require("./server");
const monitor = require("./monitor");

monitor();

var app = express();

app.use(server(webpackDefine.apiUri));

app.listen(webpackDefine.port, function () {
    console.log("Website (" + webpackDefine.configuration + ") listening on port " + webpackDefine.port + " for path " + __dirname);
});