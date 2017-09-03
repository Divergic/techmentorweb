const express = require("express");
const helmet = require("helmet");

const router = express.Router();

const hidePoweredBy = function (req, res, next) {
    res.removeHeader("X-Powered-By");
    next();
};

router.use(helmet.xssFilter());
router.use(helmet.frameguard({ action: "deny" }));
router.use(helmet.hsts({
    maxAge: 10886400000, // Must be at least 18 weeks to be approved by Google 
    // includeSubdomains: true, // Must be enabled to be approved by Google 
    preload: true
}));
router.use(helmet.hidePoweredBy());
router.use(helmet.noSniff());
router.use(hidePoweredBy);

module.exports = router;