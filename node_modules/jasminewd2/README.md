jasminewd [![Build Status](https://travis-ci.org/angular/jasminewd.svg?branch=master)](https://travis-ci.org/angular/jasminewd)
=========

Adapter for Jasmine-to-WebDriverJS. Used by [Protractor](http://www.github.com/angular/protractor).

**Important:** There are two active branches of jasminewd.

 - [master](https://github.com/angular/jasminewd/tree/master) is an adapter for Jasmine 1.3, and uses the package minijasminenode. It is published to npm as `jasminewd`.
 - [jasminewd2](https://github.com/angular/jasminewd/tree/jasminewd2) is an adapter for Jasmine 2.x, and uses the package jasmine. It is published to npm as `jasminewd2`.

Features
--------

 - Automatically makes tests asynchronously wait until the WebDriverJS control flow is empty.

 - If a `done` function is passed to the test, waits for both the control flow and until done is called.

 - If a test returns a promise, waits for both the control flow and the promise to resolve.

 - Enhances `expect` so that it automatically unwraps promises before performing the assertion.

Installation
------------
```
npm install jasminewd2
```

Usage
-----

Assumes selenium-webdriver as a peer dependency.

```js
// In your setup.
var JasmineRunner = require('jasmine');
var jrunner = new JasmineRunner();
require('jasminewd2');

global.driver = new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities({browserName: 'chrome'}).
    build();

jrunner.projectBaseDir = '';
jrunner.execute(['**/*_spec.js']);

// In your tests

describe('tests with webdriver', function() {
  it('will wait until webdriver is done', function() {
    // This will be an asynchronous test. It will finish once webdriver has
    // loaded the page, found the element, and gotten its text.
    driver.get('http://www.example.com');

    var myElement = driver.findElement(webdriver.By.id('hello'));

    // Here, expect understands that myElement.getText() is a promise,
    // and resolves it before asserting.
    expect(myElement.getText()).toEqual('hello world');
  });
})
```

`async` functions / `await`
---------------------------

`async` functions and the `await` keyword are likely coming in ES2017 (ES8), and
available via several compilers.  At the moment, they often break the WebDriver
control flow.
([GitHub issue](https://github.com/SeleniumHQ/selenium/issues/3037)).  You can
still use them, but if you do then you will have to use `await`/Promises for
almost all your synchronization.  See `spec/asyncAwaitSpec.ts` for details.
