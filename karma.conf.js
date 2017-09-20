const webpackConfig = require("./client/config/karma.webpack.config");
const config = require("./config");
const path = require("path");

const watchChanges = (config.compileTarget !== "hosted");
const singleRun = (config.compileTarget === "hosted");
const resultsPath = path.join(__dirname, "/TestResults");

console.log("Running tests for compileTarget " + config.compileTarget);
console.log("Writing test results to " + resultsPath);

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
    autoWatch: watchChanges,
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
    reporters: ["progress", "junit"], //, "verbose"
    colors: true,
    logLevel: config.LOG_INFO,
    singleRun: singleRun,
    concurrency: Infinity,

    junitReporter: {
      outputDir: resultsPath, // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: '', // suite will become the package name attribute in xml testsuite element
      useBrowserName: true, // add browser name to report and classes names
      nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
      classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
      properties: {}, // key value pair of properties to add to the <properties> section of the report
      xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
    }
  });
}
