const express = require("express");
const server = require("./server");
const monitor = require("./monitor");
const serverConfig = require("./serverConfig");
const Raven = require('raven');

monitor();

var app = express();

if (serverConfig.sentryDsn
    && serverConfig.sentryDsn.length > 0) {
    // The request handler must be the first middleware on the app
    app.use(Raven.requestHandler());
    
    // The error handler must be before any other error middleware
    app.use(Raven.errorHandler());    
}

app.use(server(serverConfig));

app.listen(serverConfig.port, function () {
    console.log("Website (" + serverConfig.configuration + ") listening on port " + serverConfig.port + " for path " + __dirname);
});