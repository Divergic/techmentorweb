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
    authClientId: "#{AUTH_CLIENTID}",
    clientApplicationInsightsKey: "#{APPLICATIONINSIGHTS_KEY}",
    
    // Server configuration
    // NOTE: Port needs to be the string representation here so that the string value is written to the bundle rather than the bundle time value in node
    port: "process.env.PORT",
    serverApplicationInsightsKey: "#{APPLICATIONINSIGHTS_KEY}"
};