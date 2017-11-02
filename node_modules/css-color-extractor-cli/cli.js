#!/usr/bin/env node

var usage = 'Usage: css-color-extractor <inputFile?> <outputFile?>' +
    '[-g|--without-grey] [-m|--without-monochrome]';

var colors = require('colors');

var argv = require('yargs')
    .usage(usage)
    .alias('g', 'without-grey')
    .alias('m', 'without-monochrome')
    .alias('f', 'format')
    .argv;

var inputFile = argv._[0] || null;

var outputFile = argv._[1] || null;

var options = {
    withoutGrey:       argv.g,
    withoutMonochrome: argv.m,
    format:            argv.f
};

var cli = require('./');

try {
    cli(inputFile, outputFile, options);
} catch (e) {
    console.error(colors.red(e.message || e));
}
