'use strict';

module.exports = function (inputFile, outputFile, options) {
    var fs = require('fs');
    var _ = require('underscore');
    var colorObj = require('color');

    function sortColors(colors) {
        colors.sort(function (a, b) {
            return colorObj(a).hue() - colorObj(b).hue();
        });
    }

    function toHtml(data) {
        var extractor = require('css-color-extractor');
        var colors = extractor.fromCss(data, options);
        var template = fs.readFileSync(__dirname+'/templates/html.tpl', 'utf8');
        var render = _.template(template);

        sortColors(colors);

        return render({ colors: colors, colorObj: colorObj });
    }

    function toList(data) {
        var extractor = require('css-color-extractor');
        var colors = extractor.fromCss(data, options);

        sortColors(colors);

        return colors.join('\n');
    }

    function toJson(data) {
        var extractor = require('css-color-extractor');
        var colors = extractor.fromCss(data, options);

        sortColors(colors);

        return JSON.stringify(colors);
    }

    function toCss(data) {
        var postcss = require('postcss');
        var colorsOnly = require('postcss-colors-only');
        var css = postcss(colorsOnly(options)).process(data).css;

        return css.toString();
    }

    function processInput(input) {
        var output;

        if (outputFile && typeof options.format === 'undefined') {
            var path = require('path');
            var extension = path.extname(outputFile);

            switch (extension) {
                case '.css':
                case '.sass':
                case '.scss':
                case '.less':
                    options.format = 'css';
                    break;
                case '.json':
                case '.js':
                    options.format = 'json';
                    break;
                case '.html':
                case '.htm':
                    options.format = 'html';
                    break;
                default:
                    break;
            }
        }

        switch (options.format) {
            case 'json':
                output = toJson(input);
                break;
            case 'css':
                output = toCss(input);
                break;
            case 'html':
                output = toHtml(input);
                break;
            default:
                output = toList(input);
                break;
        }

        if (outputFile) {
            fs.writeFileSync(outputFile, output);
        } else {
            console.log(output);
        }
    }

    function processStdin() {
        var data = '';

        process.stdin.setEncoding('utf8');

        process.stdin.on('readable', function () {
            var chunk = process.stdin.read();

            if (chunk !== null) {
                data += chunk;
            }
        });

        process.stdin.on('end', function () {
            if (!data) {
                throw new Error('No input specified.');
            }

            processInput(data);
        });
    }

    function processInputFile() {
        if (!inputFile) {
            throw new Error('No input specified.');
        }

        fs.readFile(inputFile, 'utf8', function (err, data) {
            if (err) {
                throw new Error(err);
            }

            processInput(data);
        });
    }

    if (!process.stdin.isTTY) {
        processStdin();
    } else {
        processInputFile();
    }
};
