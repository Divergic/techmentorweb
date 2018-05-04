function buildConfiguration() {
    let config = {
        apiUri: webpackDefine.apiUri,
        applicationInsightsKey: webpackDefine.applicationInsightsKey,
        authDomain: webpackDefine.authDomain,
        configuration: webpackDefine.configuration,
        environment: webpackDefine.environment,
        port: webpackDefine.port,
        reportUri: webpackDefine.reportUri,
        sentryDsn: webpackDefine.sentryDsn,
        sentryToken: webpackDefine.sentryToken,
        version: webpackDefine.version
    };
    
    if (config.reportUri
        && config.reportUri.length > 0) {
        // There is a reportUri value
        
        if (config.environment
            && config.environment.length > 0) {
            config.reportUri += "&sentry_environment=" + config.environment;
        }

        if (config.version
            && config.version.length > 0) {
            config.reportUri += "&sentry_release=" + config.version;
        }
    }

    return config;
}

module.exports = buildConfiguration();