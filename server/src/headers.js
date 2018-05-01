const express = require("express");
const helmet = require("helmet");

function buildConfiguration(serverConfig) {
};

module.exports = function(serverConfig){
    const router = express.Router();

    router.use(helmet.xssFilter());
    router.use(helmet.frameguard({ action: "deny" }));
    router.use(helmet.hsts({
        maxAge: 10886400000, // Must be at least 18 weeks to be approved by Google 
        includeSubdomains: false, // Must be enabled to be approved by Google 
        preload: false
    }));
    router.use(helmet.expectCt({
        enforce: false,
        maxAge: 0,
        reportUri: serverConfig.reportUri
    }));
    router.use(helmet.referrerPolicy({ policy: 'same-origin' }))
    router.use(helmet.hidePoweredBy());
    router.use(helmet.noSniff());

    return router;
} 