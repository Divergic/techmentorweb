module.exports = {
    apiUri: webpackDefine.apiUri,
    applicationInsightsKey: webpackDefine.applicationInsightsKey,
    authDomain: webpackDefine.authDomain,
    configuration: webpackDefine.configuration,
    environment: webpackDefine.environment,
    port: webpackDefine.port,
    version: webpackDefine.version,
    reportUri: "https://sentry.io/api/1195783/security/?sentry_key=025317d899744da5911331d72424adfa&sentry_environment=" + serverConfig.environment + (serverConfig.version ? "&sentry_release=" + serverConfig.version : "")
}