'use strict';

const fs = require('fs');
const camelCase = require('camel-case');
const imageComparison = require('../');
const path = require('path');
const screenshotPath = path.resolve(__dirname, '../.tmp/actual/');
const differencePath = path.resolve(__dirname, '../.tmp/diff/');
const helpers = require('./helpers');

describe('protractor-image-comparison', () => {
    beforeEach(done => {
        browser.imageComparson = new imageComparison({
            baselineFolder: './test/baseline/desktop/',
            debug: false,
            formatImageName: `{tag}-${logName}-{width}x{height}-dpr-{dpr}`,
            screenshotPath: './.tmp/'
        });

        browser.get(browser.baseUrl)
            .then(() => browser.sleep(500))
            .then(done);
    });

    // Chrome remembers the last postion when the url is loaded again, this will reset it.
    afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

    const logName = camelCase(browser.logName);
    const resolution = '1366x768';
    const dangerAlert = element(by.css('.uk-alert-danger'));
    const headerElement = element(by.css('h1.uk-heading-large'));

    describe('basics', () => {
        it('should save the screen', () => {
            const tagName = 'examplePage';

            browser.imageComparson.saveScreen(tagName)
                .then(() => expect(helpers.fileExistSync(`${screenshotPath}/${tagName}-${logName}-${resolution}-dpr-1.png`)).toBe(true));
        });

        it('should save an element', () => {
            const tagName = 'examplePageElement';

            browser.imageComparson.saveElement(headerElement, tagName)
                .then(() => expect(helpers.fileExistSync(`${screenshotPath}/${tagName}-${logName}-${resolution}-dpr-1.png`)).toBe(true));
        });

        it('should save a fullpage screenshot', () => {
            const tagName = 'fullPage';

            browser.imageComparson.saveFullPageScreens(tagName, {timeout: '1500a'})
                .then(() => expect(helpers.fileExistSync(`${screenshotPath}/${tagName}-${logName}-${resolution}-dpr-1.png`)).toBe(true));

        });

        it('should copy an image to the baseline when autoSaveBaseline is true', () => {
            const tagName = 'autoSaveBaseline';
            const baselineFolder = path.resolve(__dirname, '../.tmp/baseline/desktop/');

            browser.imageComparson = new imageComparison({
                baselineFolder: baselineFolder,
                autoSaveBaseline: true,
                formatImageName: `{tag}-${logName}-{width}x{height}-dpr-{dpr}`,
                screenshotPath: './.tmp/'
            });

            expect(helpers.fileExistSync(`${baselineFolder}/${tagName}-${logName}-${resolution}-dpr-1.png`)).toBe(false, 'Error: Baseline image already exists.');
            browser.imageComparson.checkScreen(tagName)
                .then(() => expect(helpers.fileExistSync(`${baselineFolder}/${tagName}-${logName}-${resolution}-dpr-1.png`)).toBe(true, 'File is saved in the baseline'));
        });
    });

    describe('compare screen', () => {
        const examplePage = 'example-page-compare';
        const examplePageFail = `${examplePage}-fail`;

        it('should compare successful with a baseline', () => {
            expect(browser.imageComparson.checkScreen(examplePage)).toEqual(0);
        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement());
            browser.imageComparson.checkScreen(examplePageFail)
                .then(() => expect(helpers.fileExistSync(`${differencePath}/${examplePageFail}-${logName}-${resolution}-dpr-1.png`)).toBe(true));
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page";', headerElement.getWebElement())
                .then(() => expect(browser.imageComparson.checkScreen(examplePageFail)).toBeGreaterThan(0));
        });

        it('should throw an error when no baseline is found', () => {
            browser.imageComparson.checkScreen('noImage')
                .then(() => fail(new Error('This should not succeed')))
                .catch((error) => expect(error).toEqual('Image not found, saving current image as new baseline.'));
        });
    });

    describe('compare element', () => {
        const dangerAlertElement = 'dangerAlert-compare';
        const dangerAlertElementFail = `${dangerAlertElement}-fail`;

        it('should compare successful with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.sleep(500))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElement)).toEqual(0));
        });

        it('should compare successful with a baseline with custom dimensions that is NOT scrolled', () => {
            expect(browser.imageComparson.checkElement(headerElement, 'resizeDimensions-header-element', {resizeDimensions: 15})).toEqual(0);
        });

        it('should compare successful with a baseline with custom dimensions that is scrolled', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.sleep(500))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, `resizeDimensions-${dangerAlertElement}`, {resizeDimensions: 15})).toEqual(0));

        });

        it('should save a difference after failure', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement());
            browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail)
                .then(() => expect(helpers.fileExistSync(`${differencePath}/${dangerAlertElementFail}-${logName}-${resolution}-dpr-1.png`)).toBe(true));
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                .then(() => browser.sleep(500))
                .then(() => expect(browser.imageComparson.checkElement(dangerAlert, dangerAlertElementFail)).toBeGreaterThan(0));
        });

        it('should throw an error when no baseline is found', () => {
            browser.executeScript('arguments[0].scrollIntoView();', dangerAlert.getWebElement())
                .then(() => browser.imageComparson.checkElement(dangerAlert, 'noImage'))
                .then(() => fail(new Error('This should not succeed')))
                .catch((error) => expect(error).toEqual('Image not found, saving current image as new baseline.'));
        });

        if (browser.browserName === 'chrome') {
            describe('resemble api', () => {
                it('should succeed comparing 2 non identical images with each other with ignoreAntialiasing enabled', () => {
                    browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                        .then(() => browser.sleep(500))
                        .then(() => expect(browser.imageComparson.checkElement(dangerAlert, `${dangerAlertElementFail}-ignore-antialiasing`, {ignoreAntialiasing: true})).toEqual(0));
                });

                it('should fail comparing 2 non identical images with each other with ignoreColors enabled', () => {
                    browser.executeScript('arguments[0].scrollIntoView(); arguments[0].style.color = "#2d7091";', dangerAlert.getWebElement())
                        .then(() => browser.sleep(500))
                        .then(() => expect(browser.imageComparson.checkElement(dangerAlert, `${dangerAlertElementFail}-ignore-colors`, {ignoreColors: true})).toEqual(1.08));
                });
            });
        }
    });

    describe('compare fullpage screenshot', () => {
        const exampleFullPage = 'example-fullpage-compare';
        const examplePageFail = `${exampleFullPage}-fail`;

        it('should compare successful with a baseline', () => {
            expect(browser.imageComparson.checkFullPageScreen(exampleFullPage)).toEqual(0);
        });

        it('should fail comparing with a baseline', () => {
            browser.executeScript('arguments[0].innerHTML = "Test Demo Page"; arguments[1].style.color = "#2d7091";', headerElement.getWebElement(), dangerAlert.getWebElement())
                .then(() => expect(browser.imageComparson.checkFullPageScreen(examplePageFail)).toBeGreaterThan(0));
        });
    });
});