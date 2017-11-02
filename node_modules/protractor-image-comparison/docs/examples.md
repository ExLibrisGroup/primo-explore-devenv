Examples
========
##Configuration file setup:
Load it from the configuration file of *protractor*

```js
exports.config = {
   // your config here ...

    onPrepare: function() {
        const protractorImageComparison = require('protractor-image-comparison');
        browser. protractorImageComparison = new protractorImageComparison(
            {
                baselineFolder: 'path/to/baseline/',
                screenshotPath: 'path/to/save/actual/screenshots/'
            }
        );
    },
}
```

##Jasmine Example:
Load it in a *spec* file

```js
const protractorImageComparison = require('protractor-image-comparison');

describe("Example page", function() {

    beforeEach(function() {
        browser.protractorImageComparison = new protractorImageComparison({
            baselineFolder: './baseline/',
            screenshotPath: './.tmp/'
        });
        browser.get('http://www.example.com/');
    });

    it("should match the page", () => {
        expect(browser.protractorImageComparison.checkScreen('examplePage')).toEqual(0);
    });

    it("should not match the page", () => {
        element(By.buttonText('yes')).click();
        expect(browser.protractorImageComparison.checkScreen('examplePage')).not.toEqual(0);
    });

    it("should match the title", () => {
        expect(browser.protractorImageComparison.checkElement(element(By.id('title')), 'examplePageTitle')).toEqual(0);
    });

    it("should match the title with blockout", () => {
        expect(browser.protractorImageComparison.checkElement(element(By.id('title')), 'examplePageTitle', {
            blockOut: [{x: 10, y: 132, width: 100, height: 50}]})).toEqual(0);
    });
});
```

##Cucumber Example:
Load it in a *step* file

```js
const expect = require('chai').expect,
      protractorImageComparison = require('protractor-image-comparison');

function CucumberSteps() {
    
    browser.protractorImageComparison = new protractorImageComparison({
        baselineFolder: './baseline/',
        screenshotPath: './.tmp/'
    });
        
    this.Given(/^I load the url$/, function () {
        return browser.get('http://www.example.com/');
    });

    this.Then(/^image\-comparison should match the page$/, function () {
        return expect(browser.protractorImageComparison.checkScreen('examplePage')).to.eventually.equal(0);
    });

    this.Then(/^image\-comparison should not match the page$/, function () {
        element(By.buttonText('yes')).click();
        return expect(browser.protractorImageComparison.checkScreen('examplePage')).to.eventually.not.equal(0);
    });

    this.Then(/^image\-comparison should match the title$/, function () {
        return expect(browser.protractorImageComparison.checkElement(element(By.id('title')), 'examplePageTitle')).to.eventually.equal(0);
    });

    this.Then(/^image\-comparison should match the title with blockout$/, function () {
        return expect(browser.protractorImageComparison.checkElement(element(By.id('title')), 'examplePageTitle', {
                blockOut: [{x: 10, y: 132, width: 100, height: 50}]}))
            .to.eventually.equal(0);
    });
}

module.exports = CucumberSteps;
```

For more examples / usage see the [desktop](../test/jasmine.spec.js) or [mobile](../test/jasmine.spec.js) testcases.