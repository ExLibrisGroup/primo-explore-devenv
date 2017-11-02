'use strict';

const assert = require('assert');
const camelCase = require('camel-case');
const fs = require('fs-extra');
const path = require('path');
const PNGImage = require('png-image');
const PNGJSImage = require('pngjs-image');
const resembleJS = require('./lib/resemble');

/**
 * image-diff protractor plugin class
 *
 * @constructor
 * @class protractorImageComparison
 * @param {object} options
 * @param {string} options.baselineFolder Path to the baseline folder
 * @param {string} options.screenshotPath Path to the folder where the screenshots are saved
 * @param {boolean} options.autoSaveBaseline If no baseline image is found the image is automatically copied to the baselinefolder
 * @param {boolean} options.debug Add some extra logging and always save the image difference (default:false)
 * @param {string} options.formatImageName Custom variables for Image Name (default:{tag}-{browserName}-{width}x{height}-dpr-{dpr})
 * @param {boolean} options.disableCSSAnimation Disable all css animations on a page (default:false)
 * @param {boolean} options.nativeWebScreenshot If a native screenshot of a device (complete screenshot) needs to be taken (default:false)
 * @param {boolean} options.blockOutStatusBar  If the statusbar on mobile / tablet needs to blocked out by default
 * @param {boolean} options.ignoreAntialiasing compare images an discard anti aliasing
 * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
 * @param {object} options.androidOffsets Object that will hold custom values for the statusBar, addressBar, addressBarScrolled and toolBar
 * @param {object} options.iosOffsets Object that will hold the custom values for the statusBar, addressBar, addressBarScrolled and toolBar
 *
 * @property {string} actualFolder Path where the actual screenshots are saved
 * @property {number} addressBarShadowPadding Mobile Chrome and mobile Safari have a shadow below the addressbar, this property will make sure that it wont be seen in the image
 * @property {object} androidOffsets Object that will hold de defaults for the statusBar, addressBar and toolBar
 * @property {number} browserHeight height of the browser
 * @property {string} browserName name of the browser that is used to execute the test on
 * @property {number} browserWidth width of the browser
 * @property {string} deviceName the kind of mobile device or emulator to use
 * @property {string} diffFolder Path where the differences are saved
 * @property {number} devicePixelRatio Ratio of the (vertical) size of one physical pixel on the current display device to the size of one device independent pixels(dips)
 * @property {number} fullPageHeight fullPageHeight of the browser including scrollbars
 * @property {number} fullPageWidth fullPageWidth of the browser including scrollbars *
 * @property {object} iosOffsets Object that will hold de defaults for the statusBar and addressBar
 * @property {boolean} isLastScreenshot boolean tells if it is the last fullpage screenshot
 * @property {string} logName logName from the capabilities
 * @property {string} name Name from the capabilities
 * @property {string} platformName mobile OS platform to use
 * @property {number} resizeDimensions dimensions that will be used to make the the element coordinates bigger. This needs to be in pixels
 * @property {number} screenshotHeight height of the screenshot of the page
 * @property {string} tempFullScreenFolder Path where the temporary fullscreens are saved
 * @property {number} fullPageScrollTimeout Default timeout to wait after a scroll
 * @property {object} saveType Object that will the type of save that is being executed
 * @property {boolean} testInBrowser boolean that determines if the test is executed in a browser or not
 * @property {number} toolBarShadowPadding Mobile mobile Safari has a shadow above the toolbar, this property will make sure that it wont be seen in the image
 * @property {number} viewPortHeight is the height of the browser window's viewport (was innerHeight
 *
 */
class protractorImageComparison {
    constructor(options) {
        assert.ok(options.baselineFolder, 'Image baselineFolder not given.');
        assert.ok(options.screenshotPath, 'Image screenshotPath not given.');

        this.baselineFolder = path.normalize(options.baselineFolder);
        this.baseFolder = path.normalize(options.screenshotPath);
        this.autoSaveBaseline = options.autoSaveBaseline || false;
        this.debug = options.debug || false;
        this.disableCSSAnimation = options.disableCSSAnimation || false;
        this.formatString = options.formatImageName || '{tag}-{browserName}-{width}x{height}-dpr-{dpr}';

        this.nativeWebScreenshot = !!options.nativeWebScreenshot;
        this.blockOutStatusBar = !!options.blockOutStatusBar;

        this.ignoreAntialiasing = options.ignoreAntialiasing || false;
        this.ignoreColors = options.ignoreColors || false;

        // OS offsets
        let androidOffsets = options.androidOffsets && typeof options.androidOffsets === 'object' ? options.androidOffsets : {};
        let iosOffsets = options.iosOffsets && typeof options.iosOffsets === 'object' ? options.iosOffsets : {};

        let androidDefaultOffsets = {
            statusBar: 24,
            addressBar: 56,
            addressBarScrolled: 0,
            toolBar: 48
        };
        let iosDefaultOffsets = {
            statusBar: 20,
            addressBar: 44,
            addressBarScrolled: 19,
            toolBar: 44
        };

        this.actualFolder = path.join(this.baseFolder, 'actual');
        this.addressBarShadowPadding = 6;
        this.androidOffsets = protractorImageComparison._mergeDefaultOptions(androidDefaultOffsets, androidOffsets);
        this.browserHeight = 0;
        this.browserName = '';
        this.browserWidth = 0;
        this.deviceName = '';
        this.diffFolder = path.join(this.baseFolder, 'diff');
        this.devicePixelRatio = 1;
        this.fullPageHeight = 0;
        this.fullPageWidth = 0;
        this.iosOffsets = protractorImageComparison._mergeDefaultOptions(iosDefaultOffsets, iosOffsets);
        this.isLastScreenshot = false;
        this.logName = '';
        this.name = '';
        this.platformName = '';
        this.resizeDimensions = 0;
        this.screenshotHeight = 0;
        this.tempFullScreenFolder = path.join(this.baseFolder, 'tempFullScreen');
        this.fullPageScrollTimeout = 1500;
        this.saveType = {
            element: false,
            fullPage: false,
            screen: false
        };
        this.testInBrowser = false;
        this.toolBarShadowPadding = 6;
        this.viewPortHeight = 0;

        fs.ensureDirSync(this.actualFolder);
        fs.ensureDirSync(this.baselineFolder);
        fs.ensureDirSync(this.diffFolder);
        fs.ensureDirSync(this.tempFullScreenFolder);
    }

    /**
     * Checks if image exists as a baseline image, if not, create a baseline image if needed
     * @param {string} tag
     * @returns {Promise}
     * @private
     */
    _checkImageExists(tag) {
        return new Promise((resolve, reject) => {
            fs.access(path.join(this.baselineFolder, this._formatFileName(tag)), error => {
                if (error) {
                    if (this.autoSaveBaseline) {
                        try {
                            fs.copySync(path.join(this.actualFolder, this._formatFileName(tag)), path.join(this.baselineFolder, this._formatFileName(tag)));
                            console.log(`\nINFO: Autosaved the image to ${path.join(this.baselineFolder, this._formatFileName(tag))}\n`);
                        } catch (error) {
                            reject(`Image could not be copied. The following error was thrown: ${error}`);
                        }
                    } else {
                        reject('Image not found, saving current image as new baseline.');
                    }
                }
                resolve();
            });
        });
    }

    /**
     * Compose a full page screenshot and save it
     * @param {string} tag The tag that is used
     * @param {number} amountOfScreenshots The amount of amountOfScreenshots that need to be processed
     * @param {number} currentScreenshotNumber The current currentScreenshotNumber of the screenshot that is being processed
     * @param {string} image The current image output that needs to be saved
     * @returns {Promise}
     * @private
     */
    _composeAndSaveFullScreenshot(tag, amountOfScreenshots, currentScreenshotNumber, image) {
        const imageHeight = this.fullPageHeight * this.devicePixelRatio;
        const imageWidth = this.viewPortWidth * this.devicePixelRatio;
        const stitchHeightCoordinate = (this.viewPortHeight - this.addressBarShadowPadding - this.toolBarShadowPadding) * (currentScreenshotNumber - 1) * this.devicePixelRatio;

        let imageOutput = image || null;

        if (currentScreenshotNumber === 1) {
            imageOutput = PNGJSImage.createImage(imageWidth, imageHeight);
        } else if (currentScreenshotNumber > amountOfScreenshots) {
            return Promise.resolve(imageOutput.writeImageSync(path.join(this.actualFolder, this._formatFileName(tag))));
        }

        const stitchImage = PNGJSImage.readImageSync(path.join(this.tempFullScreenFolder, this._formatFileName(`${tag}-${currentScreenshotNumber}`)));
        stitchImage.getImage().bitblt(imageOutput.getImage(), 0, 0, stitchImage.getWidth(), stitchImage.getHeight(), 0, stitchHeightCoordinate);

        return this._composeAndSaveFullScreenshot(tag, amountOfScreenshots, currentScreenshotNumber + 1, imageOutput)
    }

    /**
     * Determine the rectangles conform the correct browser / devicePixelRatio
     * @param {Promise} element The ElementFinder to get the rectangles of
     * @returns {Promise.<object>} returns the correct rectangles rectangles
     * @private
     */
    _determineRectangles(element) {
        let elementHeight;
        let rect;
        let elementWidth;
        let xCoordinate;
        let yCoordinate;

        return element.getSize()
            .then(elementSize => {
                elementHeight = elementSize.height;
                elementWidth = elementSize.width;

                return this._getElementPosition(element);
            })
            .then(position => {
                xCoordinate = Math.round(position.x);
                yCoordinate = Math.round(position.y);

                if (xCoordinate < this.resizeDimensions) {
                    console.log('\n WARNING: The x-coordinate may not be negative. No width resizing of the element has been executed\n');
                } else if (((xCoordinate - this.resizeDimensions) + elementWidth + 2 * this.resizeDimensions) > this.browserWidth) {
                    console.log('\n WARNING: The new coordinate may not be outside the screen. No width resizing of the element has been executed\n');
                } else {
                    xCoordinate = xCoordinate - this.resizeDimensions;
                    elementWidth = elementWidth + 2 * this.resizeDimensions
                }

                if (yCoordinate < this.resizeDimensions) {
                    console.log('\n WARNING: The y-coordinate may not be negative. No height resizing of the element has been executed\n');
                } else if ((yCoordinate < this.browserHeight && ((yCoordinate - this.resizeDimensions) + elementHeight + 2 * this.resizeDimensions) > this.browserHeight) ||
                    ((yCoordinate - this.resizeDimensions) + elementHeight + 2 * this.resizeDimensions) > this.screenshotHeight) {
                    console.log('\n WARNING: The new coordinate may not be outside the screen. No height resizing of the element has been executed\n');
                } else {
                    yCoordinate = yCoordinate - this.resizeDimensions;
                    elementHeight = elementHeight + 2 * this.resizeDimensions
                }

                rect = {
                    height: elementHeight,
                    width: elementWidth,
                    x: xCoordinate,
                    y: yCoordinate
                };

                return this._multiplyObjectValuesAgainstDPR(rect);
            });
    }

    /**
     * Determines the image comparison paths with the tags for the paths + filenames
     * @param {string} tag the tag that is used
     * @returns {Object}
     * @private
     */
    _determineImageComparisonPaths(tag) {
        const imageComparisonPaths = {};
        const tagName = this._formatFileName(tag);

        imageComparisonPaths['actualImage'] = path.join(this.actualFolder, tagName);
        imageComparisonPaths['baselineImage'] = path.join(this.baselineFolder, tagName);
        imageComparisonPaths['imageDiffPath'] = path.join(this.diffFolder, path.basename(tagName));

        return imageComparisonPaths;
    }

    /**
     * Determine the fullpage cropdata for a desktop browser
     * @param {object} cropParameters An object with all the cropparameters
     * @return {object} desktopCropData object that will hold cropHeight, cropTopPosition
     * @private
     */
    _determineFullPageDesktopCropData(cropParameters) {
        let desktopCropData = {
            'cropHeight': 0,
            'cropTopPosition': 0
        };

        // For older webdriver of Firefox and IE11, they make large (fullpage) screenshots by default
        const isLargeScreenshot = this.screenshotHeight > this.viewPortHeight;

        // Value can be equal, or bigger due to for example lazyloading
        this.fullPageHeight = isLargeScreenshot ? this.screenshotHeight : this.fullPageHeight;

        this.isLastScreenshot = this.viewPortHeight * cropParameters.currentScreenshotNumber > this.fullPageHeight;

        if (this.isLastScreenshot) {
            desktopCropData.cropHeight = this.fullPageHeight - cropParameters.previousVerticalCoordinate;
            desktopCropData.cropTopPosition = this.viewPortHeight - desktopCropData.cropHeight;
        } else {
            desktopCropData.cropHeight = this.viewPortHeight;
            desktopCropData.cropTopPosition = 0;
        }

        if (isLargeScreenshot) {
            desktopCropData.cropTopPosition = this.isLastScreenshot ? cropParameters.previousVerticalCoordinate : cropParameters.newVerticalCoordinate;
        }

        return desktopCropData;
    }

    /**
     * Determine the fullpage cropdata for a mobile browser
     * @param {object} cropParameters An object with all the cropparameters
     * @return {Promise.<object>} mobileCropData object that will hold cropHeight, cropTopPosition
     * @private
     */
    _determineFullPageMobileCropData(cropParameters) {
        let mobileCropData = {
            'cropTopPosition': 0,
            'cropHeight': 0
        };

        if (this._isAndroid()) {
            return this._getAndroidChromeStatusPlusAddressBarHeight()
                .then(statusPlusAddressBarHeight => {
                    this.isLastScreenshot = (this.viewPortHeight - this.addressBarShadowPadding - this.toolBarShadowPadding) * cropParameters.currentScreenshotNumber > this.fullPageHeight;

                    if (this.isLastScreenshot) {
                        mobileCropData.cropHeight = this.fullPageHeight - ((this.viewPortHeight - this.addressBarShadowPadding - this.toolBarShadowPadding) * (cropParameters.currentScreenshotNumber - 1));
                        mobileCropData.cropTopPosition = statusPlusAddressBarHeight + (this.viewPortHeight- this.toolBarShadowPadding) - mobileCropData.cropHeight;
                    } else {
                        mobileCropData.cropHeight = this.viewPortHeight - this.addressBarShadowPadding - this.toolBarShadowPadding;
                        mobileCropData.cropTopPosition = statusPlusAddressBarHeight + this.addressBarShadowPadding;
                    }

                    return mobileCropData;
                });
        } else {
            return this._getIOSSafariHeights()
                .then(safariHeights => {
                    this.isLastScreenshot = (this.viewPortHeight - this.addressBarShadowPadding - this.toolBarShadowPadding) * cropParameters.currentScreenshotNumber > this.fullPageHeight;

                    if (this.isLastScreenshot) {
                        mobileCropData.cropHeight = this.fullPageHeight - ((this.viewPortHeight - this.addressBarShadowPadding - this.toolBarShadowPadding) * (cropParameters.currentScreenshotNumber - 1));
                        mobileCropData.cropTopPosition = safariHeights.addressBarCurrentHeight + (this.viewPortHeight- this.toolBarShadowPadding) - mobileCropData.cropHeight;
                    } else {
                        mobileCropData.cropHeight = this.viewPortHeight - this.addressBarShadowPadding - this.toolBarShadowPadding;
                        mobileCropData.cropTopPosition = safariHeights.addressBarCurrentHeight + this.addressBarShadowPadding;
                    }

                    return mobileCropData;
                });
        }
    }

    /**
     * Compare images against each other
     * @param {string} tag The tag that is used
     * @param {object} compareOptions comparison options
     * @param {object} compareOptions.blockOut blockout with x, y, width and height values
     * @param {boolean} compareOptions.blockOutStatusBar blockout the statusbar yes or no, it will override the global
     * @param {boolean} compareOptions.ignoreAntialiasing compare images an discard anti aliasing
     * @param {boolean} compareOptions.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
     * @returns {Promise}
     * @private
     */
    _executeImageComparison(tag, compareOptions) {
        const imageComparisonPaths = this._determineImageComparisonPaths(tag);
        const ignoreRectangles = 'blockOut' in compareOptions ? compareOptions.blockOut : [];
        const blockOutStatusBar = compareOptions.blockOutStatusBar || compareOptions.blockOutStatusBar === false ? compareOptions.blockOutStatusBar : this.blockOutStatusBar;

        // comparison options are not available anymore, due to new version and api
        compareOptions.ignoreAntialiasing = 'ignoreAntialiasing' in compareOptions ? compareOptions.ignoreAntialiasing : this.ignoreAntialiasing;
        compareOptions.ignoreColors = 'ignoreColors' in compareOptions ? compareOptions.ignoreColors : this.ignoreColors;
        compareOptions.ignoreRectangles = 'ignoreRectangles' in compareOptions ? compareOptions.ignoreRectangles.push(ignoreRectangles) : ignoreRectangles;

        if (this._isMobile() && ((this.nativeWebScreenshot && compareOptions.isScreen) || (this._isIOS())) && blockOutStatusBar) {
            const statusBarHeight = this._isAndroid() ? this.androidOffsets.statusBar : this.iosOffsets.statusBar,
                statusBarBlockOut = [this._multiplyObjectValuesAgainstDPR({
                    x: 0,
                    y: 0,
                    height: statusBarHeight,
                    width: this.browserWidth
                })];

            compareOptions.ignoreRectangles = statusBarBlockOut;
        }

        if (this.debug) {
            console.log('\n####################################################');
            console.log('compareOptions = ', compareOptions);
            console.log('####################################################\n');
        }

        return new Promise(resolve => {
            resembleJS(imageComparisonPaths.baselineImage, imageComparisonPaths.actualImage, compareOptions)
                .onComplete(data => {
                    if (Number(data.misMatchPercentage) > 0 || this.debug) {
                        data.getDiffImage().pack().pipe(fs.createWriteStream(imageComparisonPaths.imageDiffPath));
                    }
                    resolve(Number(data.misMatchPercentage));
                });
        });
    }

    /**
     * _formatFileName
     * @param {string} tag The tag that is used
     * @returns {string} Returns a formatted string
     * @private
     */
    _formatFileName(tag) {
        let defaults = {
            'browserName': this.browserName,
            'deviceName': this.deviceName,
            'dpr': this.devicePixelRatio,
            'height': this.browserHeight,
            'logName': camelCase(this.logName),
            'mobile': this._isMobile() && this.testInBrowser ? this.browserName : this._isMobile() ? 'app' : '',
            'name': this.name,
            'tag': tag,
            'width': this.browserWidth
        };
        let formatString = this.formatString;

        defaults = protractorImageComparison._mergeDefaultOptions(defaults, this.formatOptions);

        Object.keys(defaults).forEach(function (value) {
            formatString = formatString.replace(`{${value}}`, defaults[value]);
        });

        return formatString + '.png';
    }

    /**
     * This methods determines the position of the element to the top of the screenshot based on a given statusbar,
     * addressbar and addressBarShadowPadding height
     * @param {Promise} element The ElementFinder that is used to get the position
     * @param {number} statusPlusAddressBarHeight The statusbar plus addressbar height
     * @param {number} addressBarShadowPadding The height of the addressbar shadow
     * @returns {Promise} The x/y position of the element
     * @private
     *
     * There is a bug in chromium to determine the correct position to the top, see:
     * https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c43
     *
     * `var elementPosition = element.getBoundingClientRect();` will not give a correct top in all cases
     */
    _getAndroidChromeElementPosition(element, statusPlusAddressBarHeight, addressBarShadowPadding) {
        function getDataObject(element, statusPlusAddressBarHeight, addressBarShadowPadding) {
            var picDummy = document.getElementById('pic-dummy');

            if (picDummy === null) {
                var dummyEl = document.createElement('div');
                dummyEl.id = "pic-dummy";
                dummyEl.style = 'position: absolute; left: 0px; top: 0px; width: 1px; height: 1px; visibility: hidden';
                document.body.appendChild(dummyEl);
            }

            picDummy = document.getElementById('pic-dummy');

            var elementPositionTop = Math.abs(document.body.scrollTop - (element.getBoundingClientRect().top - picDummy.getBoundingClientRect().top));
            var elementPositionLeft = element.getBoundingClientRect().left;

            return {
                x: elementPositionLeft,
                y: statusPlusAddressBarHeight + elementPositionTop - addressBarShadowPadding
            };
        }

        return browser.driver.executeScript(getDataObject, element.getWebElement(), statusPlusAddressBarHeight, addressBarShadowPadding);
    }

    /**
     * Get the height of the statusbar and addressbar of Android Chrome browser based on the fact that a
     * screenshot on Android is a device screenshot including:
     * - statusbar (given default height = 24 px)
     * - addressbar (can variate in height in Chrome. In chrome is can be max 56px but after scroll it will be smaller)
     * - the viewport
     * - sometimes a toolbar
     * @return {Promise.<number>}
     * @private
     */
    _getAndroidChromeStatusPlusAddressBarHeight() {
        let addressBarCurrentHeight = this.androidOffsets.addressBarScrolled;

        return this._getBrowserData()
            .then(() => {
                // Address bar is there including a toolbar
                if (this.browserHeight === (this.androidOffsets.statusBar + this.androidOffsets.addressBar + this.viewPortHeight + this.androidOffsets.toolBar)) {
                    addressBarCurrentHeight = this.androidOffsets.addressBar;
                } else if (this.browserHeight === (this.androidOffsets.statusBar + this.androidOffsets.addressBar + this.viewPortHeight)) {
                    // Address bar is there without a toolbar
                    addressBarCurrentHeight = this.androidOffsets.addressBar;
                }

                return this.androidOffsets.statusBar + addressBarCurrentHeight;
            });
    }

    /**
     * Get browserdata containing sizes, heights and so on to update the the constructor properties
     * @return {Promise}
     * @private
     */
    _getBrowserData() {
        return browser.driver.executeScript(retrieveData, this._isMobile(), this.addressBarShadowPadding, this.toolBarShadowPadding)
            .then(browserData => {
                this.browserHeight = browserData.height !== 0 ? browserData.height : browserData.viewPortHeight;
                this.browserWidth = browserData.width !== 0 ? browserData.width : browserData.viewPortWidth;
                // Firefox creates screenshots in a different way. Although it could be taken on a Retina screen,
                // the screenshot is returned in its original (no factor x is used) dimensions
                this.devicePixelRatio = this._isFirefox() ? this.devicePixelRatio : browserData.pixelRatio;
                this.fullPageHeight = browserData.fullPageHeight;
                this.fullPageWidth = browserData.fullPageWidth;
                this.viewPortHeight = browserData.viewPortHeight;
                this.viewPortWidth = browserData.viewPortWidth;
            });

        // For viewPortWidth use document.body.clientWidth so we don't get the scrollbar included in the size
        function retrieveData(isMobile, addressBarShadowPadding, toolBarShadowPadding) {
            return {
                fullPageHeight: document.body.scrollHeight - addressBarShadowPadding - toolBarShadowPadding,
                fullPageWidth: document.body.scrollWidth,
                height: isMobile ? window.screen.height : window.outerHeight,
                pixelRatio: window.devicePixelRatio,
                viewPortWidth: document.body.clientWidth,
                viewPortHeight: window.innerHeight,
                width: isMobile ? window.screen.width : window.outerWidth
            };
        }
    }

    /**
     * Get the position of the element based on OS / Browser / Device.
     * Some webdrivers make a screenshot of the complete page, not of the visible part.
     * A device can make a complete screenshot of the screen, including statusbar and addressbar / buttonbar, but it can
     * also be created with ChromeDriver. Then a screenshot will be made of the viewport and the calculation is the same
     * as for a Chrome desktop browser.
     * The rest of the browsers make a screenshot of the visible part.
     * @param {Promise} element The ElementFinder that is used to get the position
     * @returns {Promise.<object>} The x/y position of the element
     * @private
     */
    _getElementPosition(element) {
        if (this._isIOS()) {
            return this._getIOSSafariHeights()
                .then(safariHeights => this._getIOSPosition(element, safariHeights));
        } else if (this._isAndroid() && this.nativeWebScreenshot) {
            return this._getAndroidChromeStatusPlusAddressBarHeight()
                .then(statusPlusAddressBarHeight => this._getAndroidChromeElementPosition(element, statusPlusAddressBarHeight, this.addressBarShadowPadding))
        } else if (this.screenshotHeight > this.viewPortHeight && !this._isAndroid()) {
            return this._getElementPositionTopPage(element);
        }

        return this._getElementPositionTopWindow(element);
    }

    /**
     * Get the position of a given element according to the TOP of the PAGE
     * @param {Promise} element The ElementFinder that is used to get the position
     * @returns {Promise} The x/y position of the element
     * @private
     */
    _getElementPositionTopPage(element) {
        return element.getLocation()
            .then(point => {
                return {x: point.x, y: point.y};
            });
    }

    /**
     * Get the position of a given element according to the TOP of the WINDOW
     * @param {Promise} element The ElementFinder that is used to get the position
     * @returns {Promise} The x/y position of the element
     * @private
     */
    _getElementPositionTopWindow(element) {
        return browser.driver.executeScript('return arguments[0].getBoundingClientRect();', element.getWebElement())
            .then(position => {
                return {x: position.left, y: position.top};
            });
    }

    /**
     * Set the data of the instance that is running
     * @returns {Promise.<object>}
     * @private
     */
    _getInstanceData() {
        return browser.getProcessedConfig()
            .then(browserConfig => {
                this.browserName = browserConfig.capabilities.browserName ? browserConfig.capabilities.browserName.toLowerCase() : '';
                this.logName = browserConfig.capabilities.logName ? browserConfig.capabilities.logName : '';
                this.name = browserConfig.capabilities.name ? browserConfig.capabilities.name : '';
                this.testInBrowser = this.browserName !== '';

                // Used for mobile
                this.platformName = browserConfig.capabilities.platformName ? browserConfig.capabilities.platformName.toLowerCase() : '';
                this.deviceName = browserConfig.capabilities.deviceName ? browserConfig.capabilities.deviceName.toLowerCase() : '';
                // this.nativeWebScreenshot of the constructor can be overruled by the capabilities when the constructor value is false
                if (!this.nativeWebScreenshot) {
                    this.nativeWebScreenshot = !!browserConfig.capabilities.nativeWebScreenshot;
                }
                this.addressBarShadowPadding = (!this.saveType.screen && this._isMobile() && this.testInBrowser && ((this.nativeWebScreenshot && this._isAndroid()) || this._isIOS())) ? this.addressBarShadowPadding : 0;
                this.toolBarShadowPadding = (!this.saveType.screen && this._isMobile() && this.testInBrowser && this._isIOS()) ? this.toolBarShadowPadding : 0;

                return this._setCustomTestCSS();
            })
            .then(() => this._getBrowserData());
    }

    /**
     * This method returns the position of an element on the screen based on the fact that a screenshot on iOS is a
     * device screenshot.
     * @param {Promise} element The ElementFinder that is used to get the position
     * @param {object} heights Object that contains the needed heights
     * @returns {Promise.<object>} The x/y position of the element
     * @private
     */
    _getIOSPosition(element, heights) {
        function getDataObject(element, heights) {
            var elementPosition,
                y;

            if (heights.screenHeight === heights.viewPortHeight || heights.rotatedScreenHeight === heights.viewPortHeight) {
                /* an app with a transparent statusbar */
                elementPosition = element.getBoundingClientRect();
                y = elementPosition.top;
            } else {
                /* safari */
                elementPosition = element.getBoundingClientRect();
                y = heights.addressBarCurrentHeight + elementPosition.top;
            }

            return {
                x: elementPosition.left,
                y: y
            };
        }

        return browser.driver.executeScript(getDataObject, element.getWebElement(), heights);
    }

    /**
     * Get the heights of Apple Safari browser based on the fact that a screenshot on Apple is a device screenshot including:
     * - statusbar
     * - addressbar (can variate in height in Safari. Can be smaller after scroll, an app doesn't have a navbar)
     * - the viewport (innerheight)
     * - toolbar
     * @return {Promise.<object>} height object containing addressBarCurrentHeight, innerHeight, rotatedScreenHeight, screenHeight and screenWidth
     * @private
     */
    _getIOSSafariHeights() {
        let addressBarCurrentHeight = this.iosOffsets.addressBarScrolled;

        return this._getBrowserData()
            .then(() => {
                // iPad converts screenheight in portraitmode to a incorrect value
                const rotatedScreenHeight = this.browserHeight > this.browserWidth ? this.browserWidth : this.browserHeight;

                // Address bar is there including a toolbar
                if (this.browserHeight === (this.iosOffsets.statusBar + this.iosOffsets.addressBar + this.viewPortHeight + this.iosOffsets.toolBar)) {
                    addressBarCurrentHeight = this.iosOffsets.statusBar + this.iosOffsets.addressBar;
                } else if (this.browserHeight === (this.iosOffsets.statusBar + this.iosOffsets.addressBar + this.viewPortHeight)) {
                    // Address bar is there without a toolbar
                    addressBarCurrentHeight = this.iosOffsets.statusBar + this.iosOffsets.addressBar;
                }

                return {
                    addressBarCurrentHeight: addressBarCurrentHeight,
                    viewPortHeight: this.viewPortHeight,
                    rotatedScreenHeight: rotatedScreenHeight,
                    screenHeight: this.browserHeight,
                    screenWidth: this.browserWidth
                };
            });
    }

    /**
     * Checks if the os is Android
     * @returns {boolean}
     * @private
     */
    _isAndroid() {
        return this.platformName.toLowerCase() === 'android';
    }

    /**
     * Checks if the browser is firefox
     * @returns {boolean}
     * @private
     */
    _isFirefox() {
        return this.browserName === 'firefox';
    }

    /**
     * Checks if the os is ios
     * @returns {boolean}
     * @private
     */
    _isIOS() {
        return this.platformName.toLowerCase() === 'ios';
    }

    /**
     * For Appium and Perfecto the platformName needs to be provided, this will tell if the test is executed on mobile
     * @returns {boolean}
     * @private
     */
    _isMobile() {
        return this.platformName !== '';
    }

    /**
     * Merges non-default options from optionsB into optionsA
     *
     * @method mergeDefaultOptions
     * @param {object} optionsA
     * @param {object} optionsB
     * @return {object}
     * @private
     */
    static _mergeDefaultOptions(optionsA, optionsB) {
        optionsB = (typeof optionsB === 'object') ? optionsB : {};

        for (let option in optionsB) {
            if (optionsA.hasOwnProperty(option)) {
                optionsA[option] = optionsB[option];
            }
        }

        return optionsA;
    }

    /**
     * Return the values of an object multiplied against the devicePixelRatio
     * @param {object} values
     * @returns {Object}
     * @private
     */
    _multiplyObjectValuesAgainstDPR(values) {
        Object.keys(values).map(value => {
            values[value] *= this.devicePixelRatio;
        });

        return values;
    }

    /**
     * Save a cropped screenshot
     * @param {string} bufferedScreenshot a new Buffer screenshot
     * @param {string} folder path of the folder where the image needs to be saved
     * @param {object} rectangles x, y, height and width data to determine the crop
     * @param {string} tag The tag that is used
     * @returns {Promise} The image has been saved when the promise is resoled
     * @private
     */
    _saveCroppedScreenshot(bufferedScreenshot, folder, rectangles, tag) {
        return new PNGImage({
            imagePath: bufferedScreenshot,
            imageOutputPath: path.join(folder, this._formatFileName(tag)),
            cropImage: rectangles
        }).runWithPromise();
    }

    /**
     * Scroll to static horizontal and a given vertical coordinate on the page and wait a given time.
     * @param {number} verticalCoordinate The y-coordinate that needs to be scrolled to
     * @param {number} timeOut The time to wait after the scroll
     * @returns {Promise}
     * @private
     */
    _scrollToVerticalCoordinateAndWait(verticalCoordinate, timeOut) {
        return browser.driver.executeScript('window.scrollTo(0, arguments[0]);', verticalCoordinate)
            .then(() => browser.sleep(timeOut));
    }

    /**
     * Scroll to a given vertical coordinate and save the screenshot
     * @param {number} newVerticalCoordinate The vertical coordinate that needs to be scrolled to
     * @param {string} tag The tag that is used
     * @param {number} currentScreenshotNumber The currentScreenshotNumber of the screen that is being processed
     * @returns {Promise}
     * @private
     */
    _scrollAndSave(newVerticalCoordinate, tag, currentScreenshotNumber) {
        const previousVerticalCoordinate = (currentScreenshotNumber - 1) * this.viewPortHeight;

        let bufferedScreenshot;

        return this._scrollToVerticalCoordinateAndWait(newVerticalCoordinate, this.fullPageScrollTimeout)
            .then(() => this._getBrowserData())
            .then(() => browser.takeScreenshot())
            .then(screenshot => {
                bufferedScreenshot = new Buffer(screenshot, 'base64');

                let cropParameters = {
                    'currentScreenshotNumber': currentScreenshotNumber,
                    'newVerticalCoordinate': newVerticalCoordinate,
                    'previousVerticalCoordinate': previousVerticalCoordinate,
                };

                this.screenshotHeight = (bufferedScreenshot.readUInt32BE(20) / this.devicePixelRatio); // width = 16

                if (this._isMobile() && ((this.nativeWebScreenshot && this.testInBrowser) || (this._isIOS() && this.testInBrowser))) {
                    return this._determineFullPageMobileCropData(cropParameters);
                } else {
                    return this._determineFullPageDesktopCropData(cropParameters);
                }
            })
            .then(cropData => {
                const rectangles = this._multiplyObjectValuesAgainstDPR({
                    height: cropData.cropHeight,
                    width: this.viewPortWidth,
                    x: 0,
                    y: cropData.cropTopPosition
                });

                if (this.debug) {
                    console.log('\n####################################################');
                    console.log('this.fullPageHeight = ', this.fullPageHeight);
                    console.log('this.screenshotHeight = ', this.screenshotHeight);
                    console.log('this.viewPortHeight = ', this.viewPortHeight);
                    console.log('previousVerticalCoordinate = ', previousVerticalCoordinate);
                    console.log('newVerticalCoordinate = ', newVerticalCoordinate);
                    console.log('trying currentScreenshotNumber =', currentScreenshotNumber);
                    console.log('this.isLastScreenshot = ', this.isLastScreenshot);
                    console.log(`(this.viewPortHeight * part) - this.chromeShadowPadding > this.fullPageHeight = ${(this.viewPortHeight * currentScreenshotNumber) - this.addressBarShadowPadding - this.toolBarShadowPadding} > ${this.fullPageHeight}`);
                    console.log('cropTopPosition = ', cropData.cropTopPosition);
                    console.log('rectangles =', rectangles);
                    console.log('####################################################\n');
                }

                return this._saveCroppedScreenshot(bufferedScreenshot, this.tempFullScreenFolder, rectangles, `${tag}-${currentScreenshotNumber}`);
            })
            .then(() => {
                if (this.isLastScreenshot) {
                    return this._composeAndSaveFullScreenshot(tag, currentScreenshotNumber, 1);
                } else {
                    return this._scrollAndSave((this.viewPortHeight - this.addressBarShadowPadding - this.toolBarShadowPadding) * currentScreenshotNumber, tag, currentScreenshotNumber + 1);
                }
            });
    }

    /**
     * Set inline CSS on the page under test that is needed to execute the image comparison.
     * @return {Promise}
     * @private
     */
    _setCustomTestCSS() {
        return browser.driver.executeScript(setCSS, this.disableCSSAnimation, this.addressBarShadowPadding, this.toolBarShadowPadding);

        function setCSS(disableCSSAnimation, addressBarShadowPadding, toolBarShadowPadding) {
            var animation = '* {' +
                    '-webkit-transition-duration: 0s !important;' +
                    'transition-duration: 0s !important;' +
                    '-webkit-animation-duration: 0s !important;' +
                    'animation-duration: 0s !important;' +
                    '}',
                scrollBar = '*::-webkit-scrollbar { display:none; !important}',
                bodyTopPadding = addressBarShadowPadding === 0 ? '' : 'body{padding-top:' + addressBarShadowPadding + 'px !important}',
                bodyBottomPadding = toolBarShadowPadding === 0 ? '' : 'body{padding-bottom:' + toolBarShadowPadding + 'px !important}',
                css = disableCSSAnimation ? scrollBar + animation + bodyTopPadding + bodyBottomPadding : scrollBar + bodyTopPadding + bodyBottomPadding,
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }
    }

    /**
     * Runs the comparison against an element
     *
     * @method checkElement
     *
     * @example
     * // default usage
     * browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA');
     * // blockout example
     * browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA', {blockOut: [{x: 10, y: 132, width: 100, height: 50}]});
     * // Add 15 px to top, right, bottom and left when the cut is calculated (it will automatically use the DPR)
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {resizeDimensions: 15});
     * browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA', {resizeDimensions: 15});
     * // Disable css animation on all elements
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {disableCSSAnimation: true});
     * // Ignore antialiasing
     * browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA', {ignoreAntialiasing: true});
     * // Ignore colors
     * browser.protractorImageComparison.checkElement(element(By.id('elementId')), 'imageA', {ignoreColors: true});
     *
     * @param {Promise} element The ElementFinder that is used to get the position
     * @param {string} tag The tag that is used
     * @param {object} options non-default options
     * @param {object} options.blockOut blockout with x, y, width and height values
     * @param {int} options.resizeDimensions the value to increase the size of the element that needs to be saved
     * @param {boolean} options.ignoreAntialiasing compare images an discard anti aliasing
     * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
     * @return {Promise} When the promise is resolved it will return the percentage of the difference
     * @public
     */
    checkElement(element, tag, options) {
        const checkOptions = options || {};
        checkOptions.isScreen = false;

        return this.saveElement(element, tag, checkOptions)
            .then(() => this._checkImageExists(tag))
            .then(() => this._executeImageComparison(tag, checkOptions));
    }

    /**
     * Runs the comparison against the fullpage screenshot
     *
     * @method checkFullPageScreen
     *
     * @example
     * // default
     * browser.protractorImageComparison.checkFullPageScreen('imageA');
     * // Blockout the statusbar
     * browser.protractorImageComparison.checkFullPageScreen('imageA', {blockOutStatusBar: true});
     * // Blockout a given region
     * browser.protractorImageComparison.checkFullPageScreen('imageA', {blockOut: [{x: 10, y: 132, width: 100, height: 50}]});
     * // Disable css animation on all elements
     * browser.protractorImageComparison.checkFullPageScreen('imageA', {disableCSSAnimation: true});
     * // Add timeout between scrolling and taking a screenshot
     * browser.protractorImageComparison.checkFullPageScreen('imageA',{fullPageScrollTimeout: 5000});
     * // Ignore antialiasing
     * browser.protractorImageComparison.checkFullPageScreen('imageA', {ignoreAntialiasing: true});
     * // Ignore colors
     * browser.protractorImageComparison.checkFullPageScreen('imageA', {ignoreColors: true});
     *
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {boolean} options.blockOutStatusBar blockout the statusbar yes or no, it will override the global
     * @param {object} options.blockOut blockout with x, y, width and height values
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @param {int} options.fullPageScrollTimeout The time that needs to be waited when scrolling to a point and save the screenshot
     * @return {Promise} When the promise is resolved it will return the percentage of the difference
     * @public
     */
    checkFullPageScreen(tag, options) {
        const checkOptions = options || [];
        checkOptions.isScreen = true;

        return this.saveFullPageScreens(tag, checkOptions)
            .then(() => this._checkImageExists(tag))
            .then(() => this._executeImageComparison(tag, checkOptions));
    }

    /**
     * Runs the comparison against the screen
     *
     * @method checkScreen
     *
     * @example
     * // default
     * browser.protractorImageComparison.checkScreen('imageA');
     * // Blockout the statusbar
     * browser.protractorImageComparison.checkScreen('imageA', {blockOutStatusBar: true});
     * // Blockout a given region
     * browser.protractorImageComparison.checkScreen('imageA', {blockOut: [{x: 10, y: 132, width: 100, height: 50}]});
     * // Disable css animation on all elements
     * browser.protractorImageComparison.checkScreen('imageA', {disableCSSAnimation: true});
     * // Ignore antialiasing
     * browser.protractorImageComparison.checkScreen('imageA', {ignoreAntialiasing: true});
     * // Ignore colors
     * browser.protractorImageComparison.checkScreen('imageA', {ignoreColors: true});
     *
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {boolean} options.blockOutStatusBar blockout the statusbar yes or no, it will override the global
     * @param {object} options.blockOut blockout with x, y, width and height values
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @param {boolean} options.ignoreAntialiasing compare images an discard anti aliasing
     * @param {boolean} options.ignoreColors Even though the images are in colour, the comparison wil compare 2 black/white images
     * @return {Promise} When the promise is resolved it will return the percentage of the difference
     * @public
     */
    checkScreen(tag, options) {
        let checkOptions = options || {};
        checkOptions.isScreen = true;

        return this.saveScreen(tag, checkOptions)
            .then(() => this._checkImageExists(tag))
            .then(() => this._executeImageComparison(tag, checkOptions));
    }

    /**
     * Saves an image of the screen element
     *
     * @method saveElement
     *
     * @example
     * // Default
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA');
     * // Add 15 px to top, right, bottom and left when the cut is calculated (it will automatically use the DPR)
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {resizeDimensions: 15});
     * // Disable css animation on all elements
     * browser.protractorImageComparison.saveElement(element(By.id('elementId')), 'imageA', {disableCSSAnimation: true});
     *
     * @param {Promise} element The ElementFinder that is used to get the position
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {int} options.resizeDimensions the value to increase the size of the element that needs to be saved
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @returns {Promise} The images has been saved when the promise is resolved
     * @public
     */
    saveElement(element, tag, options) {
        let saveOptions = options || [];
        let bufferedScreenshot;

        this.saveType.element = true;
        this.resizeDimensions = saveOptions.resizeDimensions ? saveOptions.resizeDimensions : this.resizeDimensions;
        this.disableCSSAnimation = saveOptions.disableCSSAnimation || saveOptions.disableCSSAnimation === false ? saveOptions.disableCSSAnimation : this.disableCSSAnimation;

        return this._getInstanceData()
            .then(() => browser.takeScreenshot())
            .then(screenshot => {
                bufferedScreenshot = new Buffer(screenshot, 'base64');
                this.screenshotHeight = (bufferedScreenshot.readUInt32BE(20) / this.devicePixelRatio); // width = 16

                return this._determineRectangles(element);
            })
            .then(rectangles => this._saveCroppedScreenshot(bufferedScreenshot, this.actualFolder, rectangles, tag));
    }

    /**
     * Saves a full page image of the screen
     *
     * @method saveFullPageScreen
     *
     * @example
     * // Default
     * browser.protractorImageComparison.saveFullPageScreen('imageA');
     * // Disable css animation on all elements
     * browser.protractorImageComparison.saveFullPageScreen('imageA',{disableCSSAnimation: true});
     * // Add timeout between scrolling and taking a screenshot
     * browser.protractorImageComparison.saveFullPageScreen('imageA',{fullPageScrollTimeout: 5000});
     *
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {int} options.fullPageScrollTimeout The time that needs to be waited when scrolling to a point and save the screenshot
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @returns {Promise} The image has been saved when the promise is resolved
     * @public
     */
    saveFullPageScreens(tag, options) {
        let saveOptions = options || [];

        this.saveType.fullPage = true;
        this.fullPageScrollTimeout = saveOptions.fullPageScrollTimeout && parseInt(saveOptions.fullPageScrollTimeout, 10) > this.fullPageScrollTimeout ? saveOptions.fullPageScrollTimeout : this.fullPageScrollTimeout;
        this.disableCSSAnimation = saveOptions.disableCSSAnimation || saveOptions.disableCSSAnimation === false ? saveOptions.disableCSSAnimation : this.disableCSSAnimation;

        // Start scrolling at y=0
        return this._getInstanceData()
            .then(() => this._scrollAndSave(0, tag, 1));
    }

    /**
     * Saves an image of the screen
     *
     * @method saveScreen
     *
     * @example
     * // Default
     * browser.protractorImageComparison.saveScreen('imageA');
     * // Disable css animation on all elements
     * browser.protractorImageComparison.saveScreen('imageA',{disableCSSAnimation: true});
     *
     * @param {string} tag The tag that is used
     * @param {object} options (non-default) options
     * @param {boolean} options.disableCSSAnimation enable or disable CSS animation
     * @returns {Promise} The image has been saved when the promise is resolved
     * @public
     */
    saveScreen(tag, options) {
        let saveOptions = options || [];

        this.saveType.screen = true;
        this.disableCSSAnimation = saveOptions.disableCSSAnimation || saveOptions.disableCSSAnimation === false ? saveOptions.disableCSSAnimation : this.disableCSSAnimation;

        return this._getInstanceData()
            .then(() => browser.takeScreenshot())
            .then(screenshot => {
                const bufferedScreenshot = new Buffer(screenshot, 'base64');
                this.screenshotHeight = (bufferedScreenshot.readUInt32BE(20) / this.devicePixelRatio); // width = 16

                const rectangles = this._multiplyObjectValuesAgainstDPR({
                    height: this.screenshotHeight > this.viewPortHeight ? this.screenshotHeight : this.viewPortHeight,
                    width: this.viewPortWidth,
                    x: 0,
                    y: 0
                });
                return this._saveCroppedScreenshot(bufferedScreenshot, this.actualFolder, rectangles, tag);
            });
    }
}

module.exports = protractorImageComparison;