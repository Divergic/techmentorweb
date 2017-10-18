const express = require("express");
const server = require("./server");
const appInsights = require('applicationinsights');

const appInsightsKey = webpackDefine.applicationInsightsKey;

if (appInsightsKey) {
    console.log("Configuring Application Insights using key " + appInsightsKey + " for environment " + webpackDefine.environment);
    
    appInsights.setup(appInsightsKey).start();
}

var app = express();

app.use(server(webpackDefine.apiUri));

app.listen(webpackDefine.port, function () {
    console.log("Website (" + webpackDefine.configuration + ") listening on port " + webpackDefine.port + " for path " + __dirname);
});
