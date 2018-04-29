const appInsights = require('applicationinsights');
const serverConfig = require("./serverConfig");
const Raven = require('raven');

module.exports = function() {
    const appInsightsKey = serverConfig.applicationInsightsKey;
    
    if (appInsightsKey
        && appInsightsKey.length > 0) {
        console.log("Configuring Application Insights using key " + appInsightsKey + " for environment " + serverConfig.environment);

        appInsights.setup(appInsightsKey).start();
    }

    const sentryDsn = serverConfig.sentryDsn;

    if (sentryDsn
        && sentryDsn.length > 0) {        
        Raven.config(sentryDsn, {
            environment: serverConfig.environment, 
            release: serverConfig.version
        }).install();
    }
};
