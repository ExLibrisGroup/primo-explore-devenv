<a name="1.2.3"></a>
## [1.2.3](https://github.com/wswebcreation/protractor-image-comparison/compare/v1.2.2...v1.2.3) (2017-03-23)


### Bug Fixes

* **chromium:** fix chromium position top bug ([d3e3471](https://github.com/wswebcreation/protractor-image-comparison/commit/d3e3471))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/wswebcreation/protractor-image-comparison/compare/v1.2.0...v1.2.1) (2017-02-11)


### Bug Fixes

* **dependencies:** update dependencies ([c7c19f3](https://github.com/wswebcreation/protractor-image-comparison/commit/c7c19f3))
* **dependency:** update dev dependencies for commits ([930b405](https://github.com/wswebcreation/protractor-image-comparison/commit/930b405))
* **IE11:** fix retrieveData syntax error ([5189622](https://github.com/wswebcreation/protractor-image-comparison/commit/5189622))
* **resemblejs:** update resemblejs to latest version with less heap allocations ([55266de](https://github.com/wswebcreation/protractor-image-comparison/commit/55266de))
* **sauceconf:** fix type in sauceconf ([35da109](https://github.com/wswebcreation/protractor-image-comparison/commit/35da109))
* **saucelabs:** fix for update endstatus ([a2dfbac](https://github.com/wswebcreation/protractor-image-comparison/commit/a2dfbac))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/wswebcreation/protractor-image-comparison/compare/v1.1.0...v1.2.0) (2017-02-05)


### Features

* add mobile fullpage support for iOS and Android ([c8310b1](https://github.com/wswebcreation/protractor-image-comparison/commit/c8310b1))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/wswebcreation/protractor-image-comparison/compare/v1.0.0...v1.1.0) (2017-01-19)


### Bug Fixes

* fix dependency, update travis, fix docs ([b9ac27c](https://github.com/wswebcreation/protractor-image-comparison/commit/b9ac27c))


### Features

* **auto-baseline:** update core with autoSaveBaseline and update docs ([020f7c9](https://github.com/wswebcreation/protractor-image-comparison/commit/020f7c9))
* add option to automatically copy a file to the baseline if it doesn't exists incl tests ([0974fdd](https://github.com/wswebcreation/protractor-image-comparison/commit/0974fdd))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/wswebcreation/protractor-image-comparison/compare/v0.1.5...v1.0.0) (2016-12-18)


### Bug Fixes

* **chrome-screenshots:** add new baselinescreenshots ([2624d55](https://github.com/wswebcreation/protractor-image-comparison/commit/2624d55))
* **mobile:** fix blockOutStatusBar in _executeImageComparison for iOS ([a7ea346](https://github.com/wswebcreation/protractor-image-comparison/commit/a7ea346))


### Features

* **fullpage-appium:** first screenshots for appium chromedriver fullpage ([7b91ebb](https://github.com/wswebcreation/protractor-image-comparison/commit/7b91ebb))
* **mobile-fullpage:** initial commit for mobile android support, needs to be refactored ([592d135](https://github.com/wswebcreation/protractor-image-comparison/commit/592d135))


### BREAKING CHANGES

* chrome-screenshots: the scrollbar in Chrome is hidden by default. This causes a bigger screenshot result and may break with the baseline images of chrome



<a name="0.1.5"></a>
## [0.1.5](https://github.com/wswebcreation/protractor-image-comparison/compare/v0.1.4...v0.1.5) (2016-12-05)


### Bug Fixes

* **comparison-api:** incorrect comparison api implementation, do not use version 0.1.4 ([6112bb8](https://github.com/wswebcreation/protractor-image-comparison/commit/6112bb8))
* **scrollbar:** remove scrollbars during saveScreen ([5a2c1df](https://github.com/wswebcreation/protractor-image-comparison/commit/5a2c1df))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/wswebcreation/protractor-image-comparison/compare/v0.1.3...v0.1.4) (2016-12-04)


### Bug Fixes

* **checkFullPageScreenshot:** add ignoreRectangles ([a9c66a9](https://github.com/wswebcreation/protractor-image-comparison/commit/a9c66a9))
* **coverage:** optimized tests and coverage to 92.13,80,92.86,92.13 This is starting point ([f5290cf](https://github.com/wswebcreation/protractor-image-comparison/commit/f5290cf))
* **fullpage:** saveFullPageScreenshot beta for chrome, firefox latest and edge ([f7fb8cf](https://github.com/wswebcreation/protractor-image-comparison/commit/f7fb8cf))
* **resemble:** fix code issues ([2350f77](https://github.com/wswebcreation/protractor-image-comparison/commit/2350f77))
* **resemble:** merge resemble.js latest stuff, add tests ([6e5988b](https://github.com/wswebcreation/protractor-image-comparison/commit/6e5988b))
* **resemble:** merge resemble.js latest stuff, add tests ([306a69a](https://github.com/wswebcreation/protractor-image-comparison/commit/306a69a))
* **unittest:** add basic unit test and coverage for resemblejs 94.75,80,92.86,94.75 ([0707cf3](https://github.com/wswebcreation/protractor-image-comparison/commit/0707cf3))


### Features

* **fullpage:** add ie11 and firefox for large screenshots ([849c4f9](https://github.com/wswebcreation/protractor-image-comparison/commit/849c4f9))
* **fullpage:** initial commit of fullpage screenshot. now saved as seperate files ([4f60b6c](https://github.com/wswebcreation/protractor-image-comparison/commit/4f60b6c))
* **index:** add checkFullPage, testcases and images. Add disableAnimation ([3646829](https://github.com/wswebcreation/protractor-image-comparison/commit/3646829))
* **resemble:** refactor resemble and add 2 new features, see docs.Add unit tests ([09df28b](https://github.com/wswebcreation/protractor-image-comparison/commit/09df28b))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/wswebcreation/protractor-image-comparison/compare/v0.1.2...v0.1.3) (2016-11-22)


### Bug Fixes

* **element:** fix issue with determine elm position on large screen, fix determin position ([0756520](https://github.com/wswebcreation/protractor-image-comparison/commit/0756520))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/wswebcreation/protractor-image-comparison/compare/v0.1.1...v0.1.2) (2016-11-21)


### Bug Fixes

* **_getIOSPosition:** remove app specific implementation ([62295a1](https://github.com/wswebcreation/protractor-image-comparison/commit/62295a1))
* **baseline:** replace baselineimages for resizeDimensions ([ee82ee7](https://github.com/wswebcreation/protractor-image-comparison/commit/ee82ee7))
* **basline:** replace baseline images for resizeDimensions ([04e1399](https://github.com/wswebcreation/protractor-image-comparison/commit/04e1399))
* **dependencies:** set hard devdependencies ([d38fff8](https://github.com/wswebcreation/protractor-image-comparison/commit/d38fff8))
* **nativeWebScreenshot:** fix nativeWebScreenshot only overrule if value is false ([94e0636](https://github.com/wswebcreation/protractor-image-comparison/commit/94e0636))
* **resizeDimensions:** fix false statement ([f3d819e](https://github.com/wswebcreation/protractor-image-comparison/commit/f3d819e))


### Features

* **initial:** initial commit ([023df41](https://github.com/wswebcreation/protractor-image-comparison/commit/023df41))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/wswebcreation/protractor-image-comparison/compare/v0.1.0...v0.1.1) (2016-11-10)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/wswebcreation/protractor-image-comparison/compare/327c136...v0.1.0) (2016-11-10)


### Features

* **code:** initial commit of protractor-image-comparison ([327c136](https://github.com/wswebcreation/protractor-image-comparison/commit/327c136))
* **core:** add resizeDimensions for save / checkElement and update docs ([cc4afc6](https://github.com/wswebcreation/protractor-image-comparison/commit/cc4afc6))
* **mobile:** add blockOutStatusBar default an custom, clean baseline and update tests ([b6b7cd3](https://github.com/wswebcreation/protractor-image-comparison/commit/b6b7cd3))



