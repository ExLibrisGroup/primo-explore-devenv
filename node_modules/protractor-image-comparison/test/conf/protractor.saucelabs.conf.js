'use strict';

let config = require('./protractor.shared.conf.js').config;
let SauceLabs = require('saucelabs');

const SAUCE_USERNAME = process.env.SAUCE_USERNAME ? process.env.SAUCE_USERNAME : process.env.IC_SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY ? process.env.SAUCE_ACCESS_KEY : process.env.IC_SAUCE_ACCESS_KEY;
const deskSpecs = ['../jasmine.spec.js'];
const mobileSpecs = ['../mobile.spec.js'];

let JOB_ID;

config.seleniumAddress = 'http://ondemand.saucelabs.com:80/wd/hub';

config.multiCapabilities = [

    // Mobile
    {
        // SauceLabs
        appiumVersion: "1.6.3",
        browserName: 'Safari',
        deviceName: "iPhone 6 Simulator",
        deviceOrientation: "portrait",
        platformName: 'iOS',
        platformVersion: '10.0',
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: process.env.TRAVIS_JOB_NUMBER,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "iPhone 6 Simulator Safari",
        shardTestFiles: true,
        specs: mobileSpecs
    },
    {
        // SauceLabs
        appiumVersion: "1.6.3",
        browserName: 'Safari',
        deviceName: "iPad Air 2 Simulator",
        deviceOrientation: "portrait",
        platformName: 'iOS',
        platformVersion: '10.0',
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: process.env.TRAVIS_JOB_NUMBER,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "iPad Air 2 Simulator Safari",
        shardTestFiles: true,
        specs: mobileSpecs
    },
    // Desktop
    {
        // SauceLabs
        browserName: 'chrome',
        platform: "Windows 10",
        version: "latest",
        screenResolution: "1400x1050",
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: process.env.TRAVIS_JOB_NUMBER,
        // passed: true,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Chrome latest",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        // SauceLabs
        browserName: 'firefox',
        platform: "Windows 10",
        version: "latest",
        screenResolution: "1400x1050",
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: process.env.TRAVIS_JOB_NUMBER,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Firefox latest",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        // SauceLabs
        browserName: 'firefox',
        platform: "Windows 10",
        version: "47",
        screenResolution: "1400x1050",
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: process.env.TRAVIS_JOB_NUMBER,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Firefox 47",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        // SauceLabs
        browserName: 'internet explorer',
        platform: "Windows 8.1",
        version: "11.0",
        screenResolution: "1400x1050",
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: process.env.TRAVIS_JOB_NUMBER,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "IE11",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        // SauceLabs
        browserName: 'MicrosoftEdge',
        platform: "Windows 10",
        version: "latest",
        screenResolution: "1400x1050",
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: process.env.TRAVIS_JOB_NUMBER,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Microsoft Edge latest",
        shardTestFiles: true,
        specs: deskSpecs
    },
    // Use 9 and 10 because of the different webdriver, 9 has an old and 10 a new
    {
        // SauceLabs
        browserName: 'safari',
        platform: "OS X 10.11",
        version: "9",
        screenResolution: "1600x1200",
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: process.env.TRAVIS_JOB_NUMBER,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Safari 9",
        shardTestFiles: true,
        specs: deskSpecs
    },
    {
        // SauceLabs
        browserName: 'safari',
        platform: "OS X 10.11",
        version: "10",
        screenResolution: "1600x1200",
        username: SAUCE_USERNAME,
        accessKey: SAUCE_ACCESS_KEY,
        build: process.env.TRAVIS_JOB_NUMBER,
        public: "public",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
        logName: "Safari 10",
        shardTestFiles: true,
        specs: deskSpecs
    }
];

config.onComplete = function () {
    return browser.getSession()
        .then(session => {
            JOB_ID = session.getId();
        })
};

config.onCleanUp = function (exitCode) {
    const saucelabs = new SauceLabs({
        username: SAUCE_USERNAME,
        password: SAUCE_ACCESS_KEY
    });

    return new Promise((resolve, reject) => {
        saucelabs.updateJob(JOB_ID, {
                passed: exitCode === 0,
            },
            () => resolve(),
            error => reject('Error:', error));
    });
};

exports.config = config;
