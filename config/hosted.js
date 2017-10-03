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
    
    // Server configuration
    port: process.env.PORT,
};