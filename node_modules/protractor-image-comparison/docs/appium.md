Appium
==========
# READ FIRST
**This documentation explains how ImageComparison can work with Appium. It will not explain how to install Appium or how to automate with Appium, please refer to the Appium documentation on the Appium site.**

#### Note 1
Some cloudservices that provide emulators / real devices in the cloud (like [Perfecto](https://www.perfectomobile.com/) or [SauceLabs](https://saucelabs.com/)) create screenshots of the complete screen (like a native screenshot). 
They need a different way of determining the position of an element. Image Comparison can already do this for iOS Safari, but to get this working for Android add `nativeWebScreenshot: true` to the Image Comparison parameters.

ImageComparison is tested with: 

* iOS simulators with Safari (see iOS config below)
* Android Emulator Nexus 5 (default from AVD, see Android config below) with Chrome (for install see Android)

**Creating screenshots / region screenshots with the above configurations work. It is not tested with a Hybrid App, but it will probably work.**
 
 
# iOS
## How screenshots works for iOS
Appium creates a screenshot of the complete screen of the device. When a screenshot of Safari is made, the screenshot can hold the following elements:

* Statusbar (the "small" top bar that will hold time, wifi, battery, ...)
* Addressbar (the bar that will hold the url)
* View (the actual view of the page you are visiting)
* Toolbar (will hold additional buttons for the browser)

See "Scrolling" for the behaviour of Safari and the screenshots below for the influence
The `saveScreen` and `checkScreen` methods use the complete screen, see below. 
The `saveElement` and `checkElement` also use the complete screenshot, but the position of the element on the screenshot may differ.
If for example the position after a scroll is not determined correctly it can fail, see ![Safari saveElement / checkElement, manual / simulated scroll](./images/iPhone6-scrolledPageElement-safari-375x667-manual-fail.png "Safari saveElement / checkElement, Failed scroll").
The iOS method is smart enough to detect the way of scrolling and the position of the element on the page.

## Scrolling
### Manually
When a user scrolls the screen manually the the addressbar and the Toolbar are influenced by this behaviour. For Safari the addressbar is made smaller and the toolbar is minimized.
### Simulate
When the scroll is automated with a "native Appium" command the real use scroll is simulated and the behaviour of the addressbar and toolbar is the same as the manual scroll
### Javascript
When the scroll is automated with a Javascript scroll 

```js
browser.executeScript('arguments[0].scrollIntoView();', element(by.css('div h1')).getWebElement());
``` 

the view is scrolled, but the addressbar AND the toolbar **ARE NOT INFLUENCED** BY THIS BEHAVIOUR.

## Capabilities iOS

```
{
    browserName: 'safari',   // {mandatory} not case sensitive
    deviceName: 'iPhone 6',  // {mandatory} Needs to be form the list of available devices
    platformName: 'ios',     // {mandatory} not case sensitive
    platformVersion: '9.3'  // {optional} needed for specific ios version, else takes the default
}
```

# Android
## Browser
When an Emulator is used Chrome is only default provided from Android > 7.0.
If an older version of Android needs to be used, Chrome needs to be installed manually. 

### Install Chrome
Execute the following steps to install Chrome on Android < 7.0

* Download a Chrome APK from [APKMirror](http://www.apkmirror.com/apk/google-inc/chrome/), check which processor is used in the Emulator (ARM or X86, X86 is faster).
* Open the Emulator
* Install the `chrome.apk` from the folder where it is saved with the following command `adb install chrome.apk`. 

`````
[100%] /data/local/tmp/chrome.apk
       	pkg: /data/local/tmp/chrome.apk
Success
`````

* When the message `Success` is shown `Chrome` is installed on the device.

## How screenshots work on Android
Appium can create 2 types of screenshots for Android based on:
- Chromedriver (default)
- ADB (Appium >= 1.5.3)

### Chromedriver (default)
Chromedriver creates a screenshot of the **(visible)viewport**

![Chrome ChromeDriver saveScreen / checkScreen] (./images/avdForNexus5ByGoogle_examplePage_ChromeDriver.png "Chrome ChromeDriver saveScreen / checkScreen") 

### ADB (Appium >= 1.5.3)
ADB creates a screenshot of the **complete screen** (as iOS does with Safari).
This can be compared with the Native screenshot that can be made with a device. The ADB screenshot can hold:
* Statusbar (the "small" top bar that will hold time, wifi, battery, ...)
* Addressbar (the bar that will hold the url)
* View (the actual view of the page you are visiting)
* Toolbar (optional, will hold additional Android buttons, like home, back and menu) 

To use ADB screenshots add this in this capability in the capabilities `nativeWebScreenshot: true`, see "Capabilities Android" example below.

![ADB saveScreen / checkScreen] (./images/avdForNexus5ByGoogle_examplePage_ADB.png "ADB saveScreen / checkScreen") 

#### Note 1
It looks like taking a screenshot with ADB reacts different on a scroll (`elm.scrollIntoView()` seems to take more time). This is why a sleep, in the tests, is added after scrolling to be sure the screenshot is taken of the correct screen state.

#### Note 2
See "Scrolling" for the behaviour of Chrome and the screenshots below for the influence

#### Scrolling with Chrome and ADB native screenshot

##### Manually
When a user scrolls the screen manually then the addressbar is influenced by this behaviour. For Chrome the addressbar is minimized.
##### Simulate
When the scroll is automated with a "native Appium" command the real user scroll is simulated and the behaviour of the addressbar is the same as the manual scroll
##### Javascript
When the scroll is automated with a Javascript scroll `browser.executeScript('arguments[0].scrollIntoView();', element(by.css('div h1')).getWebElement());` the view is scrolled, but the addressbar **IS NOT INFLUENCED** by this behaviour.

## Capabilities Android

```
{
    browserName: 'chrome',                      // {mandatory} not case sensitive
    deviceName: 'AVD_for_Nexus_5_by_Google',    // {mandatory} Needs to be form the list of available devices
    platformName: 'android'                     // {mandatory} not case sensitive
    platformVersion: '7.0',                     // {optional} needed for specific Android version,
    nativeWebScreenshot: true                   // to use adb screenshots (complete screenshot), default is ChromeDriver
}
```

# Screenshots
Hover over the screenshots to see which screenshot belongs to Safari, Android ChromeDriver of Android ADB.

## saveScreen / checkScreen
### Not scrolled:
![Safari saveScreen / checkScreen](./images/iPhone6-examplePage-safari-375x667.png "Safari saveScreen / checkScreen") ![Chrome ChromeDriver saveScreen / checkScreen](./images/avdForNexus5ByGoogle_examplePage_ChromeDriver.png "Chrome ChromeDriver saveScreen / checkScreen") ![Chrome ADB saveScreen / checkScreen](./images/avdForNexus5ByGoogle_examplePage_ADB.png "Chrome ADB saveScreen / checkScreen")

### Manual / Simulated scroll:
![Safari saveScreen / checkScreen, manual / simulated scroll](./images/iPhone6-scrolledPage-safari-375x667-manual-scroll.png "Safari saveScreen / checkScreen, manual / simulated scroll") ![Chrome ChromeDriver saveScreen / checkScreen, manual / simulated scroll](./images/avdForNexus5ByGoogle-scrolledPage-chrome-360x640-chromedriver.png "Chrome ChromeDriver saveScreen / checkScreen, manual / simulated scroll") ![Chrome ADB saveScreen / checkScreen, manual / simulated scroll](./images/avdForNexus5ByGoogle-scrolledPage-chrome-360x640-manual-scroll-ADB.png "Chrome ADB saveScreen / checkScreen, manual / simulated scroll")

### Javascript scroll: 
![Safari saveScreen / checkScreen,  JS scroll](./images/iPhone6-scrolledPage-safari-375x667-JS-scroll.png "Safari saveScreen / checkScreen,  JS scroll") ![Chrome ChromeDriver saveScreen / checkScreen, manual / simulated scroll](./images/avdForNexus5ByGoogle-scrolledPage-chrome-360x640-chromedriver.png "Chrome ChromeDriver saveScreen / checkScreen, manual / simulated scroll") ![Chrome ADB saveScreen / checkScreen,  JS scroll](./images/avdForNexus5ByGoogle-scrolledPage-chrome-360x640-JS-scroll-ADB.png "Chrome ADB saveScreen / checkScreen,  JS scroll")

## saveElement / checkElement
### Not scrolled:
![Safari saveElement / checkElement](./images/iPhone6-examplePageElement-safari-375x667.png "Safari saveElement / checkElement") ![Chrome saveElement / checkElement](./images/avdForNexus5ByGoogle-examplePageElement-chrome-360x640.png "Chrome saveElement / checkElement")

### Manual / Simulated / JS scroll:
![Safari saveElement / checkElement, manual / simulated / JS scroll](./images/iPhone6-scrolledPageElement-safari-375x667-JS-scroll.png "Safari saveElement / checkElement, manual / simulated / JS scroll") ![Chrome saveElement / checkElement, manual / simulated / JS scroll](./images/avdForNexus5ByGoogle-scrolledPageElement-chrome-360x640.png "Chrome saveElement / checkElement, manual / simulated / JS scroll")
