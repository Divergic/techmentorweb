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
    authDomain: "techmentor.auth0.com",
    authAuthorizeUri: "https://techmentor.auth0.com/authorize",
    authClientId: "pgbWchlK1lxblyok5oYOe7vCGvhb0yTE",
    authResponseType: "token id_token",
    authScope: "openid profile email",
    apiUri: "https://techmentorapidev.azurewebsites.net/",
    clientSentryUri: "",

    // Server configuration
    port: process.env.port || process.env.npm_package_config_port || "8043",
    serverSentryUri: "",
};