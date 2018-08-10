'use strict';

var path = require('path');
var VisualRegressionCompare = require('wdio-visual-regression-service/compare');


function getScreenshotName(basePath) {

  return function(context) {
    var testName = context.test.title;
    var browserName = context.browser.name;
    console.log(path.join(basePath, `${testName}_${browserName}.png`));
    return path.join(basePath, `${testName}_${browserName}.png`);
  };
}


exports.config = {
    
    host: '127.0.0.1',
    port: 4444,
    path: '/wd/hub',
    
    
    specs: [
        './test/specs/try.js'
    ],
   
    maxInstances: 1,

    capabilities: [
        //android
        {
            browserName: '',
            //deviceName: "emulator-5554",
            deviceName: "7C5831B16389",
            chromedriverExecutable:`D:\\YGLCode\\driver\\XiaomiDriver\\chromedriver.exe`,
            
            nativeWebScreenshot:true,
            //deviceName: "FA68W0306042",
            //chromedriverExecutable:`D:\\YGLCode\\driver\\PexilDriver\\chromedriver.exe`,
            autoWebview:true,
            // "androidDeviceSocket":"com.youvegotleads_staging.mobile_devtools_remote",
			// "chromeOptions": {
			// "androidDeviceSocket":"com.youvegotleads_staging.mobile_devtools_remote"
			// },
            //deviceReadyTimeout:180000,
            //appWaitDuration:90000,
            //autoWebviewTimeout:90000,
            //newCommandTimeout: 180,
            //fullReset:false,
            platformName: "Android",
            //platform:'windows',
            appActivity: "MainActivity",
            appPackage: "com.youvegotleads.mobile"
            
            //appPackage: "com.youvegotleads_staging.mobile"
            
        }
        //,
        //iphone
        // {
        //                     "browserName": 'iPhone',
        //                     "platform":"iOS",
        //                     "platformName":"IOS",
        //                  autoWebview:true,
        //     	  "platformVersion": "11.3",
        //           "deviceName":"iPhone 6",
        //           //"deviceName":"iPhone 8 (64C65E8C-446D-47C8-A157-F6A0E2F41B9F) (Booted)",
        //     	  "automationName":"XCUITest",
        //     	  "bundleId":"com.youvegotleads.mobile"
        //                 }
    ],


    
    sync: true,
    //
    // Level of logging verbosity: silent | verbose | command | data | result | error
    logLevel: 'verbose',
    //
    // Enables colors for log output.
    coloredLogs: true,
    //
    // Warns when a deprecated command is used
    deprecationWarnings: true,
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Saves a screenshot to a given path if a command fails.
    //screenshotPath: './errorShots/',
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    //baseUrl: 'https://beta-staging.youvegotleads.com',
    //baseUrl: 'http://localhost:4444/grid/console',
    
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 240000,
    
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 180000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //

    reporters: [ 'allure'],
    reporterOptions: {
        allure: {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true
        }
    },
    
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 600000
    },
    
    plugins: {
        'wdio-screenshot': {
        },
      },

    services: ['visual-regression'],
    visualRegression: {
        compare: new VisualRegressionCompare.LocalCompare({            
          referenceName: getScreenshotName(path.join(process.cwd(), 'screenshots/reference')),
          screenshotName: getScreenshotName(path.join(process.cwd(), 'screenshots/taken')),
          diffName: getScreenshotName(path.join(process.cwd(), 'screenshots/diff')),
          misMatchTolerance:0.01,
        }),
    },
}
