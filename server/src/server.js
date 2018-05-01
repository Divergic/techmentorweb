const express = require("express");
const compression = require("compression");
const headers = require("./headers");
const routes = require("./routes");
const csp = require("./csp");
const https = require("./https");

module.exports = function(serverConfig) {

    const router = express.Router();
    
    router.use(compression());
    router.use(https);
    router.use(headers(serverConfig));
    router.use(csp(serverConfig));
    router.use(routes);
    
    // router.use(function (req, res, next) {
    //     res.send("This is the contents")
    //     next()
    // });
    
    return router;
}