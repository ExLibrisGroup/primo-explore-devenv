'use strict';
const program = require('commander');
const run = require('./conf/');

program
    .command('image-comparison')
    .option('-e, --env [env]', 'Run e2e tests [local, saucelabs, android.adb, android.chromedriver, ios.simulator, perfecto]')
    .option('-s, --seleniumAddress [seleniumAddress]', 'The seleniumAddress')
    .description('Run tests on a given device')
    .action(run);

program
    .parse(process.argv);
