module.exports = {

    // Commpiler configuration
    configuration: "release",
    selfHost: false,

    // Common configuration
    environment: "#{RELEASE_ENVIRONMENTNAME}",
    version: "#{BUILD_BUILDNUMBER}",
    apiUri: "#{API_URI}",

    // Client configuration
    authAudience: "#{API_URI}",
    authDomain: "#{AUTH_DOMAIN}",
    authClientId: "#{AUTH_CLIENTID}",
    clientApplicationInsightsKey: "#{APPLICATIONINSIGHTS_KEY}",
    sentryDsn: "https://025317d899744da5911331d72424adfa@sentry.io/1195783",
    sentryToken: "#{SENTRY_TOKEN}",
    
    // Server configuration
    // NOTE: Port needs to be the string representation here so that the string value is written to the bundle rather than the bundle time value in node
    port: "process.env.PORT",
    serverApplicationInsightsKey: "#{APPLICATIONINSIGHTS_KEY}",
    reportUri: "https://sentry.io/api/1195783/security/?sentry_key=025317d899744da5911331d72424adfa"
};