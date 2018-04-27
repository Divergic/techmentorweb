const appInsights = require('applicationinsights');
const serverConfig = require("./serverConfig");

module.exports = function() {
    const appInsightsKey = serverConfig.applicationInsightsKey;
    
    if (!appInsightsKey) {
        return;
    }

    if (appInsightsKey.length === 0) {
        return;
    }

    console.log("Configuring Application Insights using key " + appInsightsKey + " for environment " + serverConfig.environment);
    
    appInsights.setup(appInsightsKey).start();
};
