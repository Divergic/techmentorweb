const appInsights = require('applicationinsights');

module.exports = function() {
    const appInsightsKey = webpackDefine.applicationInsightsKey;
    
    if (!appInsightsKey) {
        return;
    }

    if (appInsightsKey.length === 0) {
        return;
    }

    console.log("Configuring Application Insights using key " + appInsightsKey + " for environment " + webpackDefine.environment);
    
    appInsights.setup(appInsightsKey).start();
};
