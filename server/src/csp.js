const helmetCsp = require("helmet-csp");

module.exports = function(serverConfig){
    let cspConfig = {
        // Specify directives as normal. 
        directives: {
            defaultSrc: ["'none'"],
            fontSrc: [
                "https://fonts.gstatic.com/s/materialicons/",
                "https://fonts.gstatic.com/s/roboto/"
            ],
            scriptSrc: [
                "'self'",
                "https://az416426.vo.msecnd.net/scripts/a/ai.0.js"
            ],
            styleSrc: [
                "'self'",
                "https://fonts.googleapis.com/css",
                "'sha256-9iC16eiNI1e6dFoJ6/SJJIi6ZZfhUXTig+K2uNbM938='",    // vuetify
                "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",    // vue-upload-component
                "'sha256-+onguRe7LDXTfXKGrhm7p/a/6xGSbwMMINhJL2d65YI='"     // vue-upload-component
            ],
            connectSrc: [
                "'self'",
                "https://dc.services.visualstudio.com/v2/track",
                "https://sentry.io/api/1195783/store/",
                "https://sentry.io/api/1195783/security/",
                "https://" + serverConfig.authDomain + "/",
                serverConfig.apiUri
            ],
            imgSrc: [
                "'self'",
                "data:",
                serverConfig.apiUri
            ],
            objectSrc: ["'none'"]
        },
        
        // Set to true if you only want browsers to report errors, not block them 
        reportOnly: false,
        
        // Set to true if you want to blindly set all headers: Content-Security-Policy, 
        // X-WebKit-CSP, and X-Content-Security-Policy. 
        setAllHeaders: false,
        
        // Set to true if you want to disable CSP on Android where it can be buggy. 
        disableAndroid: false,
        
        // Set to false if you want to completely disable any user-agent sniffing. 
        // This may make the headers less compatible but it will be much faster. 
        // This defaults to `true`. 
        browserSniff: true
    };
    
    let reportUri = serverConfig.reportUri;

    if (reportUri
        && reportUri.length > 0) {
        cspConfig.directives.reportUri = reportUri;
    }
    
    return helmetCsp(cspConfig);
} 
