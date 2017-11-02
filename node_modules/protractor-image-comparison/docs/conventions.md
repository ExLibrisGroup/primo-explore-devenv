#Conventions
There are directory and naming conventions that must be met.

##Directory structure
```text
path
└── to
    └── screenshots
        ├── diff
        │   └── examplePage-chrome-1280x1024-dpr-1.png
        ├── examplePage-chrome-800x600-dpr-1.png
        ├── examplePage-chrome-1280x1024-dpr-1.png
        ├── examplePageTitle-chrome-800x600-dpr-1.png
        └── examplePageTitle-chrome-1280x1024-dpr-1.png
```
The `baselineFolder` directory must contain all the *approved* images. You may create subdirectories for better organisation, but the relative path should then be given in the test spec method. Failed comparisons generate a diff image under the **diff** folder.

## Image naming
Images should obey the following default format:

`````
{descriptionInCamelCase}-{browserName}-{browserWidth}x{browserHeight}-dpr-{dpr}.png
`````

The naming convention can be customized by passing the parameter `formatImageName` with a format string like:

`````
{browserName}_{tag}_{width}-{height}
`````

The following variables can be passed to format the string
* `browserName` The browser name property from the capabilities
* `deviceName` The deviceName from capabilities
* `dpr` The device pixel ratio
* `logName` The logName from capabilities
* `mobile` This will add `_app`, of `browserName` after the deviceName to distinguish app screenshots from browser screenshots
* `name` The name from capabilities