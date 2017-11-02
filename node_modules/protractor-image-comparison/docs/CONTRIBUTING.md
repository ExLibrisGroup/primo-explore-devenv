Contributing
============

#Tests
There are several test that need to be executed to be able to test the module:

## Local
- `npm t` or `npm t -- -e local`: Run all tests on a local machine on Chrome and Firefox (job uses direct connect, first run `npm run wd-update` to update the webdriver. 
This needs to be done once after install).

## local on Appium
**First make sure Appium v 1.5.3 or higher is installed**

- `npm t -- -e android.adb`: Run all tests with Appium on an Android emulator with the ADB driver on Chrome (`appium --port 4728 --avd AVD_for_Nexus_5_by_Google`)
- `npm t -- -e android.chromedriver`: Run all tests with Appium on an Android emulator with the ChromeDriver on Chrome (`appium --port 4727 --avd AVD_for_Nexus_5_by_Google`)
- `npm t -- -e ios.simulator`: Run all tests with Appium on Apple iOS simulator on Safari (`appium --port 4726`)

## Travis-ci with Sauce Labs
- `npm t -- -e saucelabs`: This command is used to test the build through [Travis-ci](https://travis-ci.org/wswebcreation/protractor-image-comparison/). 
It will test against a lot of configurations that can be found [here](./test/conf/protractor.saucelabs.conf.js).

All PR's are automatically checked against SauceLabs.

## Perfecto (cloud services for real devices)
**Make sure you have an account and create a `perfecto.config.json` file in the root of this project with a `user`, a `password`- and a `seleniumAddress` key! like this:**

`````
{
  "password": "password",
  "user": "username",
  "seleniumAddress": "https://yourcloud.perfectomobile.com/nexperience/perfectomobile/wd/hub/"
}
`````

- `npm t -- -e perfecto.android`: Run all tests on a real Android device on Chrome in the cloud (credentials are needed to be able to test this)
- `npm t -- -e perfecto.ios`: Run all tests on a real Apple iOS device on Safari in the cloud (credentials are needed to be able to test this)