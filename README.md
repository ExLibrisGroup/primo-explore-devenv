# New Primo UI

## Setting up the dev environments

Assuming you have node and npm installed locally you'll have to install the dependencies and install gulp globally:

```
npm install
npm install gulp -g
```

Then to start the server up with Docker:

```
# Setup your views
git clone https://github.com/NYULibraries/primo-explore-nyu.git primo-explore/custom/NYU-NUI
...
docker-compose up
```

To run on your local machine and not on Docker you can use the following customized gulp task:

```
gulp run --gulpfile=nyu-gulpfile.js --view=NYU-NUI --browserify
```

We're using an NYU-specific gulpfile so that we can override the css compilation before the default watchers are setup.

## Building CSS

When developing or creating a package the Primo gulp watchers will compile a `custom1.css` file from all the files in `css/*.css`. Because we use SCSS, we want to make sure we first compile down to a base CSS so the Primo watchers can do their thing so we overrode the `custom-css` task in [`gulp/custom/tasks/compile-scss.js`](blob/master/gulp/custom/tasks/compile-scss.js#L15)

## Building JS

When developing or creating a package the Primo gulp watchers will compile a `custom.js` file from all the files in `js/*.js`

## Build a package

```
gulp create-package
```

## Resources

- [ExLibris Javascript recipes](https://github.com/ExLibrisGroup/primo-explore-package/blob/master/VIEW_CODE/js/README.md)
- [ExLibris CSS recipes](https://github.com/ExLibrisGroup/primo-explore-package/blob/master/VIEW_CODE/css/README.md)
- [ExLibris Primo New UI overview](https://github.com/ExLibrisGroup/primo-explore-devenv)
- [ExLibris Primo New UI best practices](https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/New_Primo_User_Interface/New_UI_Customization_-_Best_Practices)
- [ExLibris Primo New UI package manager](https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/Back_Office_Guide/090Primo_Utilities/The_UI_Customization_Package_Manager)
- [Community contributions](https://github.com/search?utf8=%E2%9C%93&q=primo-explore)
