#Methods

##saveScreen or checkScreen 
The methods `saveScreen` and `checkScreen` create a screenshot of the visible viewport. Be aware that there are different webdriver implementations in creating complete screenshots.
For example:

- **screenshot of visible viewport:**
    - Chrome
    - Safari
    - Firefox when geckodriver is used (as of version 48 and higher)
    - Microsoft Edge
- **screenshots of complete page**
    - Firefox when firefoxdriver is used (verion 47 and lower)
    - Internet Explorer (11 and lower)

Code details and example usage can be found [here](./index.md).

##saveElement or checkElement 
Images are cropped from the complete screenshot by using the `saveElement` or `checkElement` function. 
The method will calculate the correct dimensions based upon the webdriver element selector.

Code details and example usage can be found [here](./index.md).

##NEW saveFullPageScreens or checkFullPageScreen 
The methods `saveFullPageScreens` and `checkFullPageScreen` create a screenshot of the **complete** page. Basically it will device the complete page into multiple viewports. 
Then it will scroll to each viewport, waits a given timeout (default 1000 milliseconds) and takes a screenshot. When all the viewports have been captured it will compose a new complete fullpage screenshot.
These methods will also work on pages with lazyloading. By altering the `timeout` you can set it to wait for how long the lazyloading will take and then take a screenshot. It wil automatically recalculate the height of the full screen

Code details and example usage can be found [here](./index.md).

##protractor-image-comparison parameters:

* `baselineFolder` Defines the path to the reference images that are to be compared.
* `screenshotPath` Defines the path to where the "actual" captured images need to be saved.
* `autoSaveBaseline` If no baseline image is found the image is automatically copied to the baselinefolder (default:false)
* `debug` Will add extra logging to the console (default:false)
* `formatImageName` Naming format for images (default: `{tag}-{browserName}-{width}x{height}-dpr-{dpr}`), see **Conventions: image naming** for more info
* `disableCSSAnimation` Disable all css animations on a page (default: false).
* `nativeWebScreenshot` *protractor-image-comparison* needs to calculate element position based on a native device screenshot(default: false), see the [Appium docs](./appium.md) for more info.
* `blockOutStatusBar` *protractor-image-comparison* can blockout the statusbar of a device by default when comparion screens. This means that for example the time in the statusbar won't cause a failure (default:false)
* `androidOffsets` An object that will hold the pixels of the `statusBar`, `addressBar` and or the `toolBar`. The values are used to calculate the position of an element on a screen (for `saveElement` or `checkElement`). They are defaulted, but can be overridden. These values can be different per Android version. Look up the docs for developing for Android to see the values. If not provided the defaults will be used.
* `ignoreAntialiasing` Compare images an discard anti aliasing (default: false)*Remark: `ignoreColors: true` will automatically defaulted to `false` if `ignoreAntialiasing: true`*. Can also be set per testcase, see [here](./index.md) 
* `ignoreColors` Even though the images are in colour, the comparison will compare 2 black/white images (default: false). *Remark: `ignoreColors: true` will automatically defaulted to `false` if `ignoreAntialiasing: true`*. Can also be set per testcase, see [here](./index.md) 
* `iosOffsets` An object that will hold the pixels of the `statusBar` and or the `addressBar`. The values are used to calculate the position of an element on a screen (for `saveElement` or `checkElement`). They are defaulted, but can be overridden. These values can be different per iOS version. Look up the docs for developing for iOS to see the values. If not provided the defaults will be used.

**For example:**

`````
browser.protractorImageComparison = new protractorImageComparison({
	baselineFolder: './baseline/',
	screenshotPath: './.tmp/',
	debug: true,
	disableCSSAnimation: true,
	nativeWebScreenshot: true,
	blockOutStatusBar: true,
	androidOffsets: {
		statusBar: 50,
		addressBar: 100,
		toolBar: 60
	},
   iosOffsets: {
		statusBar: 40,
		addressBar: 100
	},
	ignoreAntialiasing: true
});
`````

##Method options:
### blockOut
Sometimes, it is necessary to block-out some specific areas in an image that should be ignored for comparisons. For example, this can be IDs or even time-labels that change with the time. Adding block-outs to images may decrease false positives and therefore stabilizes these comparisons (see the [examples](./examples.md)). 
It can be used for `checkElement` and `checkScreen` and is an object or list of objects with coordinates that should be blocked before comparing. (default: none).

**Keep in mind that the devicepixelratio on a browser / device influences the coordinates needed to create the blockout. Calculate the blockouts based on a screenshot (of an element) that already has been created, use for example Photoshop for this.** 

### resizeDimensions
Sometimes it is needed that the cut of an image should be bigger then the element itself. Take for example the hover state. A kind of a box / halo can be presented around the element that is not placed within but outside the element. With `resizeDimensions` the size of the cut of the element image can be made bigger. 
`resizeDimensions` accepts an integer and the value need to represent pixels. Calculation against the devicepixelratio will be done by `protractor-image-comparison`.
For example:

`````
expect(browser.imageComparson.saveElement(element(by.css('#id')), 'tagName', {resizeDimensions: 15})).toEqual(0);
// or
expect(browser.imageComparson.checkElement(element(by.css('#id')), 'tagName', {resizeDimensions: 15})).toEqual(0);
`````

### More options
For more method options and example usage see [here](./index.md).