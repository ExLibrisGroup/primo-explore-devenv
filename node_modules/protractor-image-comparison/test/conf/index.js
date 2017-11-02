'use strict';

const chalk = require('chalk');
const child_process = require('child_process');
const path = require('path');

function runTest(command) {
    const isObject = typeof command === 'object';
    const allowedEnv = ['local', 'saucelabs', 'android.adb', 'android.chromedriver', 'ios.simulator', 'perfecto'];
    const protractorRoot = path.dirname(require.resolve('protractor/package.json'));
    const protractorExec = path.normalize(path.resolve(protractorRoot, 'bin/protractor'));

    let environment = !isObject ? 'local' : command.env ? command.env : 'local';
    let seleniumAddress = !isObject ? '' : command.seleniumAddress ? `--seleniumAddress=${command.seleniumAddress}` : '';

    if (allowedEnv.indexOf(environment) === -1) environment = 'local';

    const protractorConf = path.resolve(__dirname, `../conf/protractor.${environment}.conf.js`);
    const protractor = child_process.exec(`node ${protractorExec} ${protractorConf} ${seleniumAddress}`);

    console.log(chalk.blue(`Executing the test for environment:${environment}`));

    protractor.stdout.pipe(process.stdout);
    protractor.stderr.pipe(process.stderr);
    protractor.on('exit', status => process.exit(status));
}

module.exports = runTest;
