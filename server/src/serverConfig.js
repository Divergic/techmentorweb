let config = {
    apiUri: webpackDefine.apiUri,
    applicationInsightsKey: webpackDefine.applicationInsightsKey,
    authDomain: webpackDefine.authDomain,
    configuration: webpackDefine.configuration,
    environment: webpackDefine.environment,
    port: webpackDefine.port,
    sentryDsn: webpackDefine.sentryDsn,
    version: webpackDefine.version
};

config.reportUri = "https://sentry.io/api/1195783/security/?sentry_key=025317d899744da5911331d72424adfa&sentry_environment=" + webpackDefine.environment + (webpackDefine.version ? "&sentry_release=" + webpackDefine.version : "");

module.exports = config;