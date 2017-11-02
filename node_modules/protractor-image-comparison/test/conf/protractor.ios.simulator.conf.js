'use strict';

let config = require('./protractor.shared.conf.js').config;

config.capabilities = {
    browserName: 'safari',
    deviceName: 'iPhone 6',
    logName: 'iPhone6',
    platformName: 'ios',
    platformVersion: '10.2'
};

config.seleniumAddress = 'http://localhost:4726/wd/hub';

config.specs = ['../mobile.spec.js'];

exports.config = config;