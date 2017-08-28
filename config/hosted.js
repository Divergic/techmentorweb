module.exports = {

    // Commpiler configuration
    configuration: "release",
    selfHost: false,

    // Common configuration
    environment: "#{Environment.Name}",
    version: "#{Release.Number}",
    
    // Server configuration
    port: 443,
};