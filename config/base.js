module.exports = {

    // Commpiler configuration
    compileTarget: process.env.compileTarget || process.env.npm_package_config_compileTarget || "local",
    configuration: process.env.configuration || process.env.npm_package_config_configuration || "debug",
    selfHost: process.env.selfHost || process.env.npm_package_config_selfHost || true,    

    // Common configuration
    environment: "local",
    version: "",
    
    // Client configuration
    authAudience: "https://techmentorapidev.azurewebsites.net/",
    authDomain: "techmentordev.auth0.com",
    authClientId: "nUAw34DQVLgrgz6GCJLZ2RodyKylMkXg",
    authResponseType: "token id_token",
    authScope: "openid profile email",
    apiUri: "https://techmentorapidev.azurewebsites.net/",
    clientApplicationInsightsKey: "",
    sentryDsn: "https://025317d899744da5911331d72424adfa@sentry.io/1195783",

    // Server configuration
    serverApplicationInsightsKey: ""
};