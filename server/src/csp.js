const cspConfig = require("../config/csp");
const helmetCsp = require("helmet-csp");

module.exports = helmetCsp(cspConfig);
