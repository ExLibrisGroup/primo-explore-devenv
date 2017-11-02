'use strict';

module.exports = new CssColorExtractor();

function CssColorExtractor() {
    var postcss = require('postcss');
    var util = require('util');
    var unique = require('array-unique');
    var Color = require('color');
    var propertiesWithColors = [
        'color',
        'background',
        'background-color',
        'background-image',
        'border',
        'border-top',
        'border-right',
        'border-bottom',
        'border-left',
        'border-color',
        'border-top-color',
        'border-right-color',
        'border-bottom-color',
        'border-left-color',
        'outline',
        'outline-color',
        'text-shadow',
        'box-shadow'
    ];
    var colorFormats = [
        'hexString',
        'rgbString',
        'percentString',
        'hslString',
        'hwbString',
        'keyword'
    ];

    function doesPropertyAllowColor(property) {
        return propertiesWithColors.indexOf(property) > -1;
    }

    function isColorGrey(color) {
        var red = color.red();

        // we only need to test one color
        // since isColorMonochrome assures that all
        // three rgb colors are equal

        return isColorMonochrome(color) && red > 0 && red < 255;
    }

    function isColorMonochrome(color) {
        var hsl = color.hsl();

        return hsl.h === 0 && hsl.s === 0;
    }

    function isValidColorFormat(format) {
        return colorFormats.indexOf(format) > -1;
    }

    function extractColors(string, options) {
        var colors = [];
        var values = [];

        options = util._extend({
            withoutGrey:       false,
            withoutMonochrome: false,
            colorFormat:       null
        }, options);

        postcss.list.comma(string).forEach(function (items) {
            postcss.list.space(items).forEach(function (item) {
                var regex = new RegExp(
                    '^' +
                    '(-webkit-|-moz-|-o-)?' +
                    '(repeating-)?' +
                    '(radial|linear)-gradient\\((.*?)\\)' +
                    '$'
                );

                var match = item.match(regex);

                if (match) {
                    values = values.concat(postcss.list.comma(match[4]));
                } else {
                    values.push(item);
                }
            });
        });

        values.forEach(function (value) {
            var color;

            // check if it is a valid color
            try {
                color = new Color(value);
            } catch (e) {
                return;
            }

            if (options.withoutMonochrome && isColorMonochrome(color)) {
                return;
            }

            if (options.withoutGrey && isColorGrey(color)) {
                return;
            }

            if (isValidColorFormat(options.colorFormat)) {
                value = color[options.colorFormat]();
            }

            if (value) {
                colors.push(value);
            }
        });

        return unique(colors);
    }

    function extractColorsFromDecl(decl, options) {
        if (!doesPropertyAllowColor(decl.prop)) {
            return [];
        }

        return extractColors(decl.value, options);
    }

    function extractColorsFromCss(css, options) {
        var colors = [];

        postcss.parse(css).walkDecls(function (decl) {
            colors = colors.concat(extractColorsFromDecl(decl, options));
        });

        return unique(colors);
    }

    this.fromDecl = extractColorsFromDecl;
    this.fromCss = extractColorsFromCss;
    this.fromString = extractColors;
}
