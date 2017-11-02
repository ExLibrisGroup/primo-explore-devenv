/*
 James Cryer / Huddle 2014
 URL: https://github.com/Huddle/Resemble.js
 */
'use strict';

var PNG = require('pngjs').PNG;
var fs = require('fs');

function resembleJS(fileOne, fileTwo, options) {

    var data = {};
    var images = [];
    var updateCallbackArray = [];
    var resembleOptions = options || [];

    var ignoreAntialiasing = 'ignoreAntialiasing' in resembleOptions ? resembleOptions.ignoreAntialiasing : false;
    var ignoreColors = !ignoreAntialiasing && 'ignoreColors' in resembleOptions ? resembleOptions.ignoreColors : false;
    var ignoreRectangles = 'ignoreRectangles' in resembleOptions ? resembleOptions.ignoreRectangles : null;

    var tolerance = { // between 0 and 255
        red: ignoreAntialiasing ? 32 : 16,
        green: ignoreAntialiasing ? 32 : 16,
        blue: ignoreAntialiasing ? 32 : 16,
        alpha: ignoreAntialiasing ? 32 : 16,
        minBrightness: ignoreAntialiasing ? 64 : 16,
        maxBrightness: ignoreAntialiasing ? 96 : 240
    };

    var pixelTransparency = 1;


    var errorPixelColor = { // Color for Error Pixels. Between 0 and 255.
        red: 255,
        green: 0,
        blue: 255,
        alpha: 255
    };

    var targetPix = {r: 0, g: 0, b: 0, a: 0}; // isAntialiased

    var errorPixelTransform = {
        flat: function (px, offset, d1, d2) {
            px[offset] = errorPixelColor.red;
            px[offset + 1] = errorPixelColor.green;
            px[offset + 2] = errorPixelColor.blue;
            px[offset + 3] = errorPixelColor.alpha;
        }
    };

    var errorPixel = errorPixelTransform.flat;
    var largeImageThreshold = 1200;


    function _triggerDataUpdate() {
        var len = updateCallbackArray.length;
        var i;
        for (i = 0; i < len; i++) {
            /* istanbul ignore else */
            if (typeof updateCallbackArray[i] === 'function') {
                updateCallbackArray[i](data);
            }
        }
    }

    function _loop(x, y, callback) {
        var i, j;

        for (i = 0; i < x; i++) {
            for (j = 0; j < y; j++) {
                callback(i, j);
            }
        }
    }

    function _loadImageData(fileData, callback) {

        var ext = fileData.substring(fileData.lastIndexOf(".") + 1);
        /* istanbul ignore else */

        if (ext == "png") {
            var png = new PNG();
            fs.createReadStream(fileData)
                .pipe(png)
                .on('parsed', function () {
                    callback(this, this.width, this.height);
                });
        }
    }

    function _isColorSimilar(a, b, color) {

        var absDiff = Math.abs(a - b);

        if (typeof a === 'undefined') {
            return false;
        }
        if (typeof b === 'undefined') {
            return false;
        }

        if (a === b) {
            return true;
        } else if (absDiff < tolerance[color]) {
            return true;
        } else {
            return false;
        }
    }

    function _isPixelBrightnessSimilar(d1, d2) {
        var alpha = _isColorSimilar(d1.a, d2.a, 'alpha');
        var brightness = _isColorSimilar(d1.brightness, d2.brightness, 'minBrightness');
        return brightness && alpha;
    }

    function _getBrightness(r, g, b) {
        return 0.3 * r + 0.59 * g + 0.11 * b;
    }

    function _isRGBSame(d1, d2) {
        var red = d1.r === d2.r;
        var green = d1.g === d2.g;
        var blue = d1.b === d2.b;
        return red && green && blue;
    }

    function _isRGBSimilar(d1, d2) {
        var red = _isColorSimilar(d1.r, d2.r, 'red');
        var green = _isColorSimilar(d1.g, d2.g, 'green');
        var blue = _isColorSimilar(d1.b, d2.b, 'blue');
        var alpha = _isColorSimilar(d1.a, d2.a, 'alpha');

        return red && green && blue && alpha;
    }

    function _isContrasting(d1, d2) {
        return Math.abs(d1.brightness - d2.brightness) > tolerance.maxBrightness;
    }

    function _getHue(r, g, b) {

        r = r / 255;
        g = g / 255;
        b = b / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h;
        var d;

        if (max == min) {
            h = 0; // achromatic
        } else {
            d = max - min;
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return h;
    }

    function _isAntialiased(sourcePix, data, cacheSet, verticalPos, horizontalPos, width) {
        var offset;
        var distance = 1;
        var i;
        var j;
        var hasHighContrastSibling = 0;
        var hasSiblingWithDifferentHue = 0;
        var hasEquivalentSibling = 0;

        _addHueInfo(sourcePix);

        for (i = distance * -1; i <= distance; i++) {
            for (j = distance * -1; j <= distance; j++) {

                if (i === 0 && j === 0) {
                    // ignore source pixel
                } else {

                    offset = ((verticalPos + j) * width + (horizontalPos + i)) * 4;

                    /* istanbul ignore else */
                    if (targetPix === null) {
                        continue;
                    }

                    _addBrightnessInfo(targetPix);
                    _addHueInfo(targetPix);

                    /* istanbul ignore else */
                    if (_isContrasting(sourcePix, targetPix)) {
                        hasHighContrastSibling++;
                    }

                    /* istanbul ignore else */
                    if (_isRGBSame(sourcePix, targetPix)) {
                        hasEquivalentSibling++;
                    }

                    /* istanbul ignore else */
                    if (Math.abs(targetPix.h - sourcePix.h) > 0.3) {
                        hasSiblingWithDifferentHue++;
                    }

                    /* istanbul ignore else */
                    if (hasSiblingWithDifferentHue > 1 || hasHighContrastSibling > 1) {
                        return true;
                    }
                }
            }
        }

        /* istanbul ignore else */
        if (hasEquivalentSibling < 2) {
            return true;
        }

        return false;
    }

    function _copyPixel(px, offset, data) {
        px[offset] = data.r; //r
        px[offset + 1] = data.g; //g
        px[offset + 2] = data.b; //b
        px[offset + 3] = data.a * pixelTransparency; //a
    }

    function _copyGrayScalePixel(px, offset, data) {
        px[offset] = data.brightness; //r
        px[offset + 1] = data.brightness; //g
        px[offset + 2] = data.brightness; //b
        px[offset + 3] = data.a * pixelTransparency; //a
    }

    function _getPixelInfo(dst, data, offset, cacheSet) {
        if (data.length > offset) {
            dst.r = data[offset];
            dst.g = data[offset + 1];
            dst.b = data[offset + 2];
            dst.a = data[offset + 3];

            return true;
        }

        return false;
    }

    function _addBrightnessInfo(data) {
        data.brightness = _getBrightness(data.r, data.g, data.b); // 'corrected' lightness
    }

    function _addHueInfo(data) {
        data.h = _getHue(data.r, data.g, data.b);
    }

    function _analyseImages(img1, img2, width, height) {

        var data1 = img1.data;
        var data2 = img2.data;

        var imgd = new PNG({
            width: img1.width,
            height: img1.height,
            deflateChunkSize: img1.deflateChunkSize,
            deflateLevel: img1.deflateLevel,
            deflateStrategy: img1.deflateStrategy,
        });
        var targetPix = imgd.data;

        var mismatchCount = 0;
        var diffBounds = {
            top: height,
            left: width,
            bottom: 0,
            right: 0
        };
        var updateBounds = function (x, y) {
            diffBounds.left = Math.min(x, diffBounds.left);
            diffBounds.right = Math.max(x, diffBounds.right);
            diffBounds.top = Math.min(y, diffBounds.top);
            diffBounds.bottom = Math.max(y, diffBounds.bottom);
        };

        var time = Date.now();

        var skip;

        var currentRectangle = null;
        var rectagnlesIdx = 0;

        /* istanbul ignore else */
        if (!!largeImageThreshold && ignoreAntialiasing && (width > largeImageThreshold || height > largeImageThreshold)) {
            skip = 6;
        }

        var pixel1 = {r: 0, g: 0, b: 0, a: 0};
        var pixel2 = { r: 0, g: 0, b: 0, a: 0 };

        _loop(height, width, function (verticalPos, horizontalPos) {
            /* istanbul ignore else */
            if (skip) { // only skip if the image isn't small
                /* istanbul ignore else */
                if (verticalPos % skip === 0 || horizontalPos % skip === 0) {
                    return;
                }
            }

            var offset = (verticalPos * width + horizontalPos) * 4;

            /* istanbul ignore else */
            if (!_getPixelInfo(pixel1, data1, offset, 1) || !_getPixelInfo(pixel2, data2, offset, 2)) {
                return;
            }

            /* istanbul ignore else */
            if (ignoreRectangles) {
                for (rectagnlesIdx = 0; rectagnlesIdx < ignoreRectangles.length; rectagnlesIdx++) {
                    currentRectangle = ignoreRectangles[rectagnlesIdx];
                    /* istanbul ignore else */
                    if (
                        (verticalPos >= currentRectangle.y) &&
                        (verticalPos < currentRectangle.y + currentRectangle.height) &&
                        (horizontalPos >= currentRectangle.x) &&
                        (horizontalPos < currentRectangle.x + currentRectangle.width)
                    ) {
                        _copyGrayScalePixel(targetPix, offset, pixel2);
                        return;
                    }
                }
            }

            /* istanbul ignore else */
            if (ignoreColors) {

                _addBrightnessInfo(pixel1);
                _addBrightnessInfo(pixel2);

                if (_isPixelBrightnessSimilar(pixel1, pixel2)) {
                    _copyGrayScalePixel(targetPix, offset, pixel2);
                } else {
                    errorPixel(targetPix, offset, pixel1, pixel2);
                    mismatchCount++;
                    updateBounds(horizontalPos, verticalPos);
                }
                return;
            }

            if (_isRGBSimilar(pixel1, pixel2)) {
                _copyPixel(targetPix, offset, pixel1, pixel2);

            } else if (ignoreAntialiasing && (
                    _addBrightnessInfo(pixel1), // jit pixel info augmentation looks a little weird, sorry.
                        _addBrightnessInfo(pixel2),
                    _isAntialiased(pixel1, data1, 1, verticalPos, horizontalPos, width) ||
                    _isAntialiased(pixel2, data2, 2, verticalPos, horizontalPos, width)
                )) {

                if (_isPixelBrightnessSimilar(pixel1, pixel2)) {
                    _copyGrayScalePixel(targetPix, offset, pixel2);
                } else {
                    errorPixel(targetPix, offset, pixel1, pixel2);
                    mismatchCount++;
                }
            } else {
                errorPixel(targetPix, offset, pixel1, pixel2);
                mismatchCount++;
            }

        });

        data.misMatchPercentage = (mismatchCount / (height * width) * 100).toFixed(2);
        data.diffBounds = diffBounds;
        data.analysisTime = Date.now() - time;

        data.getDiffImage = function (text) {
            return imgd;
        };
    }

    function _compare(one, two) {

        function onceWeHaveBoth(img) {
            var width;
            var height;

            images.push(img);
            if (images.length === 2) {
                if (images[0].error || images[1].error) {
                    data = {};
                    data.error = images[0].error ? images[0].error : images[1].error;
                    _triggerDataUpdate();
                    return;
                }
                width = images[0].width > images[1].width ? images[0].width : images[1].width;
                height = images[0].height > images[1].height ? images[0].height : images[1].height;

                if ((images[0].width === images[1].width) && (images[0].height === images[1].height)) {
                    data.isSameDimensions = true;
                } else {
                    data.isSameDimensions = false;
                }

                data.dimensionDifference = {
                    width: images[0].width - images[1].width,
                    height: images[0].height - images[1].height
                };

                _analyseImages(images[0], images[1], width, height);

                _triggerDataUpdate();
            }
        }

        images = [];
        _loadImageData(one, onceWeHaveBoth);
        _loadImageData(two, onceWeHaveBoth);
    }

    return {
        onComplete: function (callback) {
            updateCallbackArray.push(callback);
            return _compare(fileOne, fileTwo);
        }
    };

}

module.exports = resembleJS;