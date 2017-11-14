const helmetCsp = require("helmet-csp");

function buildConfiguration(apiUri) {
    return {
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
                "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",    // vue-upload-component
                "'sha256-+onguRe7LDXTfXKGrhm7p/a/6xGSbwMMINhJL2d65YI='"     // vue-upload-component
            ],
            connectSrc: [
                "'self'",
                "https://dc.services.visualstudio.com/v2/track",
                "https://techmentor.auth0.com/",
                apiUri
            ],
            imgSrc: [
                "'self'",
                "data:",
                apiUri
            ],
            objectSrc: ["'none'"],
            reportUri: "https://techmentors.report-uri.io/r/default/csp/enforce"
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
    }
};

module.exports = function(apiUri){
    const cspConfig = buildConfiguration(apiUri);

    return helmetCsp(cspConfig);
} 
