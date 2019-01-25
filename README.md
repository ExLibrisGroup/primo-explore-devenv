# New Primo UI

## Setting up the dev environments

Assuming you have node and yarn installed locally you'll have to install the dependencies:

```
yarn install --frozen-lockfile
```

Then to start the server up with Docker:

```
# Setup your views
git clone https://github.com/NYULibraries/primo-explore-nyu.git primo-explore/custom/NYU
...
VIEW=NYU docker-compose up web
```

To run on your local machine and not on Docker you can use the following yarn task:

```
yarn start --view=NYU
```

We're using an NYU-specific gulpfile so that we can override the css compilation before the default watchers are setup.

## Building CSS

When developing or creating a package the Primo gulp watchers will compile a `custom1.css` file from all the files in `css/*.css`. Because we use SCSS, we want to make sure we first compile down to a base CSS so the Primo watchers can do their thing so we overrode the `custom-css` task in [`gulp/custom/tasks/compile-scss.js`](blob/master/gulp/custom/tasks/compile-scss.js#L15)

## Building JS

When developing or creating a package the Primo gulp watchers will compile a `custom.js` file from all the files in `js/*.js`

## Build a package

With Docker to ensure deterministic builds.

Environment variables:
* **NODE_ENV**: represents the deployment environment ('production' or 'development')
* **VIEW**: which package will be built

**First run the package to build the `custom.js` and `custom.css` files from latest source**:
```bash
NODE_ENV=[environment] VIEW=[view] docker-compose run web
```

**Then create the package from that source**:
```bash
NODE_ENV=[environment] VIEW=[view] docker-compose run create-package
```

**Or, all at once**:
```bash
NODE_ENV=[environment] VIEW=[view] docker-compose up create-package
```

If you're willing to take the risk, you can also create packages locally in your devenv. Ensure depencies are installed with `yarn install --frozen-lockfile` to ensure consistency across environments.
```
NODE_ENV=production yarn create-package --view=NYU
```

## Deploys

Deploys must be done through the back office UI with an uploaded zip package.

1. **Notify admins and devs** by scheduling a block in the appropriate Primo calendar. This ensures no conflicts between manual deploys and jobs.

1. **Rerun your devenv** with the latest versions of all dependent views. This means to at least run CENTRAL_PACKAGE as well as the view being targeted before building the package. This ensures that all files upon which the build process depends are present and updated on your development machine.

```
yarn start --view=NYU
# Devenv starts....
# Devenv closed by user
yarn create-package --view=NYU
```

1. **Build a package.** Run `gulp create-package` to build a zip file of this customization package. The script also removes files that cause the upload to fail, specifically any files except `package.json` without the following extensions: `png`, `jpg`, `gif`, `js`, `html`, `css`.

1. **Verify that no deploys or pipes are running or scheduled.** Under Monitor Primo Status, check the following to ensure nothing is running or scheduled (Jobs need about 15 minutes after completion to finish before a deploy can be run.):
    - Schedule Tasks
    - Deploy Monitoring
    - Process Monitoring
    - Job Monitoring

1. **Upload zip file.** Navigate to Deploy & Utilities > Customization Manager. Select the appropriate view (e.g. "NYU") as View. Download the existing package in case of failure. Choose file and click "Upload".

1. **Deploy** by clicking "Deploy." You can monitor progress under "Deploy Monitoring."

## Resources

- [ExLibris Javascript recipes](https://github.com/ExLibrisGroup/primo-explore-package/blob/master/VIEW_CODE/js/README.md)
- [ExLibris CSS recipes](https://github.com/ExLibrisGroup/primo-explore-package/blob/master/VIEW_CODE/css/README.md)
- [ExLibris Primo New UI overview](https://github.com/ExLibrisGroup/primo-explore-devenv)
- [ExLibris Primo New UI best practices](https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/New_Primo_User_Interface/New_UI_Customization_-_Best_Practices)
- [ExLibris Primo New UI package manager](https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/Back_Office_Guide/090Primo_Utilities/The_UI_Customization_Package_Manager)
- [Community contributions](https://github.com/search?utf8=%E2%9C%93&q=primo-explore)
