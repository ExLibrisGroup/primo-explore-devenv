let config = require('./protractor.shared.conf.js').config;

const perfectoConfig = require('../../perfecto.config.json');

config.seleniumAddress = perfectoConfig.seleniumAddress;

config.specs = ['../mobile.spec.js'];

config.multiCapabilities = [
    {
        browserName: 'safari',
        logName: 'Perfecto Apple iPhone 7 Safari',
        manufacturer: 'Apple',
        model: 'iPhone-7',
        password: perfectoConfig.password,
        platformName: 'iOS',
        user: perfectoConfig.user
    },
    {
        browserName: 'chrome',
        logName: 'Perfecto Samsung Galaxy S6 Chrome',
        manufacturer: 'Samsung',
        model: 'Galaxy S6',
        nativeWebScreenshot: true,
        password: perfectoConfig.password,
        platformName: 'Android',
        user: perfectoConfig.user
    }
];

exports.config = config;
