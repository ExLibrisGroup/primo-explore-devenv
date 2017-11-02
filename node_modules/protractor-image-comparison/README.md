protractor-image-comparison
==========

[![dependencies Status](https://david-dm.org/wswebcreation/protractor-image-comparison/status.svg)](https://david-dm.org/wswebcreation/protractor-image-comparison) [![Build Status](https://travis-ci.org/wswebcreation/protractor-image-comparison.svg?branch=master)](https://travis-ci.org/wswebcreation/protractor-image-comparison) [![Sauce Test Status](https://saucelabs.com/buildstatus/wswebcreation-nl)](https://saucelabs.com/u/wswebcreation-nl)

[![NPM](https://nodei.co/npm/protractor-image-comparison.png)](https://nodei.co/npm/protractor-image-comparison/)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/wswebcreation-nl.svg)](https://saucelabs.com/u/wswebcreation-nl)

##What can it do?
*protractor-image-comparison* is a lightweight *protractor* plugin for browsers / mobile browsers / hybrid apps to do image comparison on screens or elements.

You can:

- save or compare screens / elements against a baseline
- **NEW:** save or compare a fullpage screenshot against a baseline (**desktop AND mobile are now supported**)
- **NEW** automatically create a baseline when no baseline is there
- disable css animations by default
- ignore anti-aliasing differences
- compare images by ignoring their colors (do a grayscale comparison)
- blockout custom regions during comparison (all)
- increase the element dimenisions screenshots (all)
- provide custom iOS and Android offsets for status-/address-/toolbar (mobile only)
- automatically exclude a statusbar during screencomparison (mobile only)

Comparison is based on [ResembleJS](https://github.com/Huddle/Resemble.js).

##Installation
Install this module locally with the following command:

```shell
npm install protractor-image-comparison
```

Save to dependencies or dev-dependencies:

```shell
npm install --save protractor-image-comparison
npm install --save-dev protractor-image-comparison
```

##Usage
*protractor-image-comparison* can be used for:

- desktop browsers (Chrome / Firefox / Safari / Internet Explorer 11 / Microsoft Edge)
- mobile / tablet browsers (Chrome / Safari on emulators / real devices) via Appium
- Hybrid apps via Appium

For more information about mobile testing see the [Appium](./docs/appium.md) documentation.

If you run for the first time without having a baseline the `check`-methods will reject the promise with the following warning:

    `Image not found, saving current image as new baseline.`

This means that the current screenshot is saved and you **manually need to copy it to your baseline**. 
If you instantiate `protractor-image-comparsion` with `autoSaveBaseline: true`, see [docs](./docs/index.md), the image will automatically be saved into the baselinefolder.


*protractor-image-comparison* provides:

- two comparison methods `checkScreen` and `checkElement`.
- two helper methods `saveElement` and `saveElement` for saving images.
- **NEW** a helper `saveFullPageScreens` and a comparison method `checkFullPageScreen` for saving and comparing a fullpage screenshot.

The comparison methods return a result in percentages like `0` or `3.94`.
*protractor-image-comparison* can work with Jasmine and Cucumber.js. See [Examples](./docs/examples.md) for or a *protractor*-config setup, or a Jasmine or a CucumberJS implementation.

More information about the **methods** can be found [here](./docs/methods.md).

## Conventions
See [conventions.md](./docs/conventions.md).

## Contribution
See [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## Credits
- Basic logic of `index.js` based on [PixDiff](https://github.com/koola/pix-diff)
- Comparison core of `./lib/resemble.js` [node-resemble](https://github.com/lksv/node-resemble.js) + [ResembleJS](https://github.com/Huddle/Resemble.js)

## TODO
* Update documentation for Mobile
* New (mobile friendly) testpage