# PostCSS Colors Only [![Build Status][ci-img]][ci]

[PostCSS] plugin to remove all rules except those which contain one or more colors.

This tool is useful if you are re-skinning a site with a new color scheme and need a starting point for a new stylesheet.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/rsanchez/postcss-colors-only.svg
[ci]:      https://travis-ci.org/rsanchez/postcss-colors-only

```css
.foo {
  color: red;
  border: 1px solid #ab560f;
  font-size: 16px;
  background-image: linear-gradient(to-bottom, red, blue);
}

.bar {
  color: rgba(0, 128, 255, 0.5);
}

.baz {
  display: block;
}
```

```css
.foo {
  color: red;
  border-color: #ab560f;
  background-image: linear-gradient(to-bottom, red, blue);
}

.bar {
  color: rgba(0, 128, 255, 0.5);
}
```

This plugin will remove any CSS rules that do not contain a color (named, hex, rgb, rgba, hsl, or hsla) value. It looks at the following CSS properties for colors:

* `color`
* `background`
* `background-color`
* `background-image`
* `border`
* `border-top`
* `border-right`
* `border-bottom`
* `border-left`
* `border-color`
* `border-top-color`
* `border-right-color`
* `border-bottom-color`
* `border-left-color`
* `outline`
* `outline-color`
* `text-shadow`
* `box-shadow`

The following CSS properties will be transformed, leaving only the color part of the declaration:

* `background` → `background-color`
* `border` → `border-color`
* `border-top` → `border-top-color`
* `border-right` → `border-right-color`
* `border-bottom` → `border-bottom-color`
* `border-left` → `border-left-color`
* `outline` → `outline-color`

## Installation

[![NPM version](https://badge.fury.io/js/postcss-colors-only.svg)](https://www.npmjs.org/package/postcss-colors-only)

[Use npm](https://www.npmjs.org/doc/cli/npm-install.html).

```
npm install postcss-colors-only
```

## Usage

```javascript
var postcss = require('postcss');
var colorsOnly = require('postcss-colors-only');
var options = {
  withoutGrey: false, // set to true to remove rules that only have grey colors
  withoutMonochrome: false, // set to true to remove rules that only have grey, black, or white colors
};

postcss()
  .use(colorsOnly(options))
  .process('a { color: red; background: #FF0 url(foo.jpg); font-size: 12px; }')
  .css;
//=> 'a { color: red; background-color: #FF0; }'
```

## CLI

This plugin is also part of a standalone command line tool. See [css-color-extractor-cli](https://github.com/rsanchez/css-color-extractor-cli).

## License

Copyright (c) 2015 [Rob Sanchez](https://github.com/rsanchez)

Licensed under [the MIT License](./LICENSE).
