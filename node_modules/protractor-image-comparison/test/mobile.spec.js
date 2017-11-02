'use strict';

const fs = require('fs');
const camelCase = require('camel-case');
const imageComparison = require('../');
const path = require('path');
const screenshotPath = path.resolve(__dirname, '../.tmp/actual/');
const differencePath = path.resolve(__dirname, '../.tmp/diff/');
const helpers = require('./helpers');

describe('protractor-protractor-image-comparison', () => {
    const logName = camelCase(browser.logName);
    const devices = {
        iPhone_6SimulatorSafari: {
            name: `${logName}-375x667-dpr-2`
        },
        iPhone6: {
            name: `${logName}-375x667-dpr-2`
        },
        iPadAir_2SimulatorSafari: {
            name: `${logName}-768x1024-dpr-2`
        },
        nexus_5ByGoogleAdb: {
            name: `${logName}-360x640-dpr-3`
        },
        nexus_5ByGoogleChromeDriver: {
            name: `${logName}-360x640-dpr-3`
        },
        perfectoAppleIPhone_7Safari: {
            blockOut: [{x: 0, y: 1246, width: 750, height: 88}],
            name: `${logName}-375x667-dpr-2`
        },
        perfectoSamsungGalaxyS6Chrome: {
            name: `${logName}-360x640-dpr-4`
        }
    };
    const dangerAlert = element(by.css('.uk-alert-danger'));
    const headerElement = element(by.css('h1.uk-heading-large'));

    let ADBScreenshot;

    // Chrome remembers the last postion when the url is loaded again, this will reset it.
    afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

    describe('basics', () => {
        beforeEach(done => {
            browser.getProcessedConfig()
                .then(_ => {
                    ADBScreenshot = _.capabilities.nativeWebScreenshot || false;

                    browser.imageComparson = new imageComparison({
                        baselineFolder: './test/baseline/mobile/',
                        debug: false,
                        formatImageName: `{tag}-${logName}-{width}x{height}-dpr-{dpr}`,
                        nativeWebScreenshot: ADBScreenshot,
                        screenshotPath: './.tmp/'
                    });

                    return browser.get(browser.baseUrl);
                })
                .then(() => browser.sleep(1000))
                .then(done);
        });

        it('should save the screen', () => {
            const tagName = 'examplePage';

            browser.imageComparson.saveScreen(tagName)
                .then(() => {
                    expect(helpers.fileExistSync(`${screenshotPath}/${tagName}-${devices[logName]['name']}.png`)).toBe(true);
                });
        });

        it('should save an element', () => {
            const tagName = 'examplePageElement';

            browser.imageComparson.saveElement(headerElement, tagName)
                .then(() => expect(helpers.fileExistSync(`${screenshotPath}/${tagName}-${devices[logName]['name']}.png`)).toBe(true));
        });

        it('should save a fullpage screenshot', () => {
            const tagName = 'fullPage';

            browser.imageComparson.saveFullPageScreens(tagName, {timeout: '1500a'})
                .then(() => expect(helpers.fileExistSync(`${screenshotPath}/${tagName}-${devices[logName]['name']}.png`)).toBe(true));
        });
    });

    describe('compare screen', () => {
        beforeEach(done => {
            browser.getProcessedConfig()
                .then(_ => {
                    ADBScreenshot = _.capabilities.nativeWebScreenshot || false;

                    browser.imageComparson = new imageComparison({
                        baselineFolder: './test/baseline/mobile/',
                        blockOutStatusBar: true,
                        formatImageName: `{tag}-${logName}-{width}x{height}-dpr-{dpr}`,
                        nativeWebScreenshot: ADBScreenshot,
                        screenshotPath: './.tmp/'
                    });

                    return browser.get(browser.baseUrl);
                })
                .then(() => browser.sleep(1000))
                .then(done);
        });

        const examplePage = 'example-page-compare';
        const examplePageFail = `${examplePage}-fail`;

        it('should compare successful with a baseline', () => {
            expect(browser.imageComparson.checkScreen(examplePage, {ignoreAntialiasing: true})).toEqual(0);
        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement())
                .then(() => browser.sleep(1000))
                .then(() => browser.imageComparson.checkScreen(examplePageFail))
                .then(() => expect(helpers.fileExistSync(`${differencePath}/${examplePageFail}-${devices[logName]['name']}.png`)).toBe(true));
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement())
                .then(() => browser.sleep(1000))
                .then(() => expect(browser.imageComparson.checkScreen(examplePageFail, {ignoreAntialiasing: true})).toBeGreaterThan(0));
        });

        it('should throw an error when no baseline is found', () => {
            browser.imageComparson.checkScreen('noImage')
                .then(() => {
                    fail(new Error('This should not succeed'))
                }, error => {
                    expect(error).toEqual('Image not found, saving current image as new baseline.');
                });
        });
    });

    describe('compare element', () => {
        beforeEach(done => {
            browser.getProcessedConfig()
                .then(_ => {
                    ADBScreenshot = _.capabilities.nativeWebScreenshot || false;

                    browser.imageComparson = new imageComparison({
                        baselineFolder: './test/baseline/mobile/',
                        formatImageName: `{tag}-${logName}-{width}x{height}-dpr-{dpr}`,
                        nativeWebScreenshot: ADBScreenshot,
                        screenshotPath: './.tmp/'
                    });

                    return browser.get(browser.baseUrl);
                })
                .then(() => browser.sleep(1000))
                .then(done);
        });

        const dangerAlertElement = 'dangerAlert-compare';
        const dangerAlertElementFail = `${dangerAlertElement}-fail`;

        it('should compare successful with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.sleep(1000))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElement)).toEqual(0));
        });

        it('should compare successful with a baseline with custom dimensions that is NOT scrolled', () => {
            expect(browser.imageComparson.checkElement(headerElement, 'resizeDimensions-header-element', {
                ignoreAntialiasing: true,
                resizeDimensions: 15
            })).toEqual(0);
        });

        it('should compare successful with a baseline with custom dimensions that is scrolled', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.sleep(1000))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, `resizeDimensions-${dangerAlertElement}`, {
                    ignoreAntialiasing: true,
                    resizeDimensions: 15
                })).toEqual(0));
        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                .then(() => browser.sleep(1000))
                .then(() => browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail))
                .then(() => expect(helpers.fileExistSync(`${differencePath}/${dangerAlertElementFail}-${devices[logName]['name']}.png`)).toBe(true));
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                .then(() => browser.sleep(1000))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail)).toBeGreaterThan(0));

        });

        it('should throw an error when no baseline is found', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.sleep(1000))
                .then(() => browser.imageComparson.checkElement(dangerAlert, 'noImage'))
                .then(() => fail(new Error('This should not succeed')))
                .catch(error => expect(error).toEqual('Image not found, saving current image as new baseline.'));
        });
    });

    describe('override default offsets', () => {
        beforeEach(done => {
            browser.getProcessedConfig()
                .then(_ => {
                    ADBScreenshot = _.capabilities.nativeWebScreenshot || false;

                    browser.imageComparson = new imageComparison({
                        baselineFolder: './test/baseline/mobile/offsets/',
                        blockOutStatusBar: true,
                        formatImageName: `{tag}-${logName}-{width}x{height}-dpr-{dpr}`,
                        nativeWebScreenshot: ADBScreenshot,
                        screenshotPath: './.tmp/',
                        // Custom android offset
                        androidOffsets: {
                            statusBar: 50,
                            addressBar: 100,
                            toolBar: 60
                        },
                        // Custom iOS offset
                        iosOffsets: {
                            statusBar: 40,
                            addressBar: 100
                        }
                    });

                    return browser.get(browser.baseUrl);
                })
                .then(() => browser.sleep(1500))
                .then(done);
        });

        // The baseline image has a bigger black bar for blocking out the status bar.
        it('should compare a screenshot successful with a baseline', () => {
            expect(browser.imageComparson.checkScreen('new-offsets', {ignoreAntialiasing: true})).toEqual(0);
        });

        // This testcase will result in an image that is not equal to the element, but that's the case we are testing here
        it('should compare an element successful with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.sleep(1000))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, 'new-offset-element', {ignoreAntialiasing: true})).toEqual(0));
        });
    });

    describe('compare fullpage screenshot', () => {
        beforeEach(function () {
            browser.getProcessedConfig()
                .then(_ => {
                    ADBScreenshot = _.capabilities.nativeWebScreenshot || false;

                    browser.imageComparson = new imageComparison({
                        baselineFolder: './test/baseline/mobile/',
                        debug: false,
                        formatImageName: `{tag}-${logName}-{width}x{height}-dpr-{dpr}`,
                        nativeWebScreenshot: ADBScreenshot,
                        screenshotPath: './.tmp/'
                    });

                    return browser.get(browser.baseUrl);
                })
                .then(() => browser.sleep(1500));
        });

        const exampleFullPage = 'example-fullpage-compare';
        const examplePageFail = `${exampleFullPage}-fail`;

        it('should compare successful with a baseline', () => {
            expect(browser.imageComparson.checkFullPageScreen(exampleFullPage, {ignoreAntialiasing: true})).toEqual(0);
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page"; arguments[1].style.color = "#2d7091";', headerElement.getWebElement(), dangerAlert.getWebElement())
                .then(() => expect(browser.imageComparson.checkFullPageScreen(examplePageFail, {ignoreAntialiasing: true})).toBeGreaterThan(0));
        });
    });
});
