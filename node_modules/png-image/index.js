'use strict';

const fs = require('fs'),
    PNG = require('pngjs').PNG,
    promise = require('promise');

/**
 * PNG-Image class
 *
 * @constructor
 * @class PNGImage
 * @param {object} options
 * @param {object[]} options.imagePath Path to in image file
 * @param {string} options.imageOutputPath Path to output image file
 * @param {object} [options.cropImage=null] Cropping for image (default: no cropping)
 * @param {int} [options.cropImage.x=0] Coordinate for left corner of cropping region
 * @param {int} [options.cropImage.y=0] Coordinate for top corner of cropping region
 * @param {int} [options.cropImage.width] Width of cropping region (default: Width that is left)
 * @param {int} [options.cropImage.height] Height of cropping region (default: Height that is left)
 * @param {int} options.composeOffset Offset of last composed image to clip (default: no offset)
 *
 * @property {string} _imagePath
 * @property {string} _imageOutputPath
 * @property {object} _cropImage
 * @property {object} _composeOffset
 * @property {PNG[]} _imageQueue
 * @property {PNG} _image
 */
class PNGImage {
    constructor(options) {
        this._imagePath = [].concat(options.imagePath);
        this._imageOutputPath = options.imageOutputPath;
        this._cropImage = options.cropImage;
        this._composeOffset = options.composeOffset;

        this._imageQueue = [];
        this._image = null;
    }

    /**
     * Composes multiple images
     *
     * @method compose
     * @returns {Promise}
     * @public
     */
    compose() {
        let composeWidth = 0,
            composeHeight = 0,
            offsetY = 0;

        return promise.resolve().then(() => {
            return this._imagePath.reduce((promise, path) => {
                return promise.then(() => {
                    return this._loadImage(path).then(image => {
                        this._imageQueue.push(image);
                    });
                });
            }, promise.resolve());
        }).then(() => {
            if (this._composeOffset) {
                // Last image requires cropping
                this._image = this._imageQueue.pop();
                this._imageQueue.push(this._crop({
                    x: 0,
                    y: this._composeOffset,
                    width: this._image.width,
                    height: (this._image.height - this._composeOffset)
                }));
            }
            // Calculate total canvas size
            for (let image of this._imageQueue) {
                composeWidth = image.width;
                composeHeight += image.height;
            }
            this._image = new PNG({width: composeWidth, height: composeHeight});
            // Compose PNG
            for (let image of this._imageQueue) {
                image.bitblt(this._image, 0, 0, image.width, image.height, 0, offsetY);
                offsetY += image.height;
            }
            return this._writeImage(this._image, this._imageOutputPath);
        });
    }

    /**
     * Runs with a promise
     *
     * @method runWithPromise
     * @returns {Promise}
     * @public
     */
    runWithPromise() {
        return this._loadImage(this._imagePath[0]).then(image => {
            this._image = image;
            if (this._cropImage) {
                this._image = this._crop(this._cropImage);
            }
            return this._writeImage(this._image, this._imageOutputPath);
        });
    }

    /**
     * Runs node-style
     *
     * @method run
     * @public
     */
    run() {
        return promise.nodeify(this.runWithPromise);
    }

    /**
     * Crops the current image to the specified size
     *
     * @method crop
     * @param {object} rect
     * @property {int} x Starting x-coordinate
     * @property {int} y Starting y-coordinate
     * @property {int} width Width of area relative to starting coordinate
     * @property {int} height Height of area relative to starting coordinate
     * @return {PNG} image Cropped image
     * @private
     */
    _crop(rect) {
        let image,
            width = Math.min(rect.width, this._image.width - rect.x),
            height = Math.min(rect.height, this._image.height - rect.y);

        if ((width < 0) || (height < 0)) {
            throw new Error('Width and height cannot be negative.');
        }

        image = new PNG({ width: width, height: height });

        this._image.bitblt(image, rect.x, rect.y, width, height, 0, 0);

        return image;
    }

    /**
     * Loads the image from path, stream or buffer
     *
     * @method _loadImage
     * @param {string|buffer} filename
     * @returns {promise}
     * @private
     */
    _loadImage(filename) {
        const image = new PNG();

        if (typeof filename === 'string') {
            return promise.denodeify(fs.readFile).call(this, filename).then(buffer => {
                return new Promise((resolve, reject) => {
                    return image.parse(buffer, (error, data) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(data);
                    });
                });
            });
        } else if (filename instanceof Buffer) {
            return new Promise((resolve, reject) => {
                return image.parse(filename, (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(data);
                });
            });
        } else {
            return promise.reject('Expected a valid image path, stream or buffer.');
        }
    }

    /**
     * Writes the image to the filesystem
     *
     * @method _writeImage
     * @param {string} filePath Path to save file
     * @returns {promise}
     * @private
     */
    _writeImage(image, filePath) {
        return promise.denodeify(fs.writeFile).call(this, filePath, PNG.sync.write(image));
    }
}

module.exports = PNGImage;