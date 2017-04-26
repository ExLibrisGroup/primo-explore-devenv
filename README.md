# New Primo UI

## Setting up the dev environments

```
docker-compose up
# Setup your views
git clone https://github.com/NYULibraries/primo-explore-nyu.git primo-explore/custom/NYU
```

## Building CSS

When developing or creating a packaged the Primo gulp watchers will compile a `custom1.css` file from all the files in `css/*.css`. Because we use SCSS, we want to make sure we first compile down to a base CSS so the Primo watchers can do their thing:

```
sass watch
# OR
gulp --gulpfile=nyu-gulpfile.js --view=NYU nyu-compile-css
```

## Building JS

When developing or creating a package the Primo gulp watchers will compile a `custom.js` file from all the files in `js/*.js`
