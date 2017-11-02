'use strict';

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    baseUrl: 'https://wswebcreation.github.io/protractor-image-comparison/',
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000,
        isVerbose: true,
        includeStackTrace: true,
        print: function() {}
    },
    onPrepare: function () {
        browser.ignoreSynchronization = true;

        jasmine.getEnv().addReporter(new SpecReporter({
            spec: {
                displayStacktrace: 'none',
                displayFailuresSummary: false,
                displayPendingSummary: false,
                displayPendingSpec: true,
                displaySpecDuration: true
            }
        }));

        return browser.getProcessedConfig()
            .then(_ => {
                browser.browserName = _.capabilities.browserName.toLowerCase();
                browser.logName = _.capabilities.logName;

                if (!('platformName' in _.capabilities)) {
                    return browser.driver.manage().window().setSize(1366, 768);
                }
            });
    }
};
