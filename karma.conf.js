const webpackConfig = require("./client/config/karma.webpack.config");

module.exports = function (config) {
  
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    browsers: ["PhantomJS"], // You may use "Chrome", "Chrome_without_security" or "PhantomJS", ChromeCanary" or "Chromium" as well 
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },
    files: [
      "./client/src/**/*.tests.ts"
    ],
    mime: {
      "text/x-typescript": ["ts"]
    },
    autoWatch: true,
    exclude: [
    ],
    preprocessors: {
      "./client/src/**/*.tests.ts": ["webpack"]
    },    
    webpack: webpackConfig,
    webpackMiddleware: {
        quiet: false,
        stats: {
            colors: true
        }
    },
    reporters: ["progress"], //, "verbose"
    colors: true,
    logLevel: config.LOG_INFO,
    singleRun: false,
    concurrency: Infinity
  });
}
