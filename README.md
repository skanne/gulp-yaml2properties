#gulp-yaml2properties

[![npm version](https://badge.fury.io/js/gulp-yaml2properties.svg)](http://badge.fury.io/js/gulp-yaml2properties)
[![Build Status](https://travis-ci.org/skanne/gulp-yaml2properties.svg?branch=master)](https://travis-ci.org/skanne/gulp-yaml2properties)
<!-- [![Dependency Status](https://david-dm.org/skanne/gulp-yaml2properties.svg)](https://david-dm.org/skanne/gulp-yaml2properties) -->

> A [Gulp](https://github.com/gulpjs/gulp) plugin to convert [YAML](https://en.wikipedia.org/wiki/YAML) to [.properties](https://en.wikipedia.org/wiki/.properties) using [js-yaml](https://github.com/nodeca/js-yaml).


## Install

```sh
npm install --save-dev gulp-yaml2properties
```

## Usage

```js
var yaml2properties = require('gulp-yaml2properties');

gulp.src('./src/*.yml')
  .pipe(yaml2properties({ schema: 'DEFAULT_SAFE_SCHEMA' }))
  .pipe(gulp.dest('./dist/'))

gulp.src('./src/*.yml')
  .pipe(yaml2properties({ safe: true }))
  .pipe(gulp.dest('./dist/'))
```


## API

### yaml2properties([options])


#### options.safe

Type: `Boolean`

Default: `true`

Enable or disable support for regexps, functions and undefined.

**This flag should always be enabled when working with untrusted data.**

When this flag is enabled then [safeLoad](https://github.com/nodeca/js-yaml#safeload-string---options-) method is used, otherwise [load](https://github.com/nodeca/js-yaml#load-string---options-).


#### options.schema

Type: `String`

Default: `DEFAULT_SAFE_SCHEMA` or `DEFAULT_FULL_SCHEMA`

Specifies what schema to use. Valid values are the same that [js-yaml](https://github.com/nodeca/js-yaml) supports, except they are received as strings (lowercase or uppercase). See the example in the Usage section of this README. The default schema is chosen using the `safe` option.


#### options.filename

Type `String`

Default: the path of the file processed

String to be used as a file path in error/warning messages.


## Credits
- [gulp-yaml](https://github.com/crissdev/gulp-yaml) served as the foundation and starting point for this package – I just had to tweak it a little bit to output `.properties` instead of `.json` files. So, all kudos belong to [Cristian Trifan](http://crissdev.com/). Mulţumesc!


## License
View the [LICENSE](https://github.com/skanne/gulp-yaml2properties/blob/master/LICENSE-MIT) file (MIT).
