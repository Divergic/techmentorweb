module.exports = {

    // Commpiler configuration
    compileTarget: process.env.compileTarget || process.env.npm_package_config_compileTarget || "local",
    configuration: process.env.configuration || process.env.npm_package_config_configuration || "debug",
    selfHost: process.env.selfHost || process.env.npm_package_config_selfHost || true,    

    // Common configuration
    environment: "local",
    version: null,
    
    // Client configuration
    authAudience: "https://techmentorapidev.azurewebsites.net/",
    authDomain: "techmentordev.auth0.com",
    authAuthorizeUri: "https://techmentordev.auth0.com/authorize",
    authClientId: "nUAw34DQVLgrgz6GCJLZ2RodyKylMkXg",
    authResponseType: "token id_token",
    authScope: "openid profile email",
    apiUri: "https://techmentorapidev.azurewebsites.net/",
    clientApplicationInsightsKey: "",

    // Server configuration
    serverApplicationInsightsKey: ""
};