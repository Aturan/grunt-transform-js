# grunt-transform-js
> A package manager helper.
> Transform javascript to specify module format such as cmd module.

## Getting Started
```shell
npm install grunt-transform-js --save-dev
```
```js
grunt.initConfig({
	transform: {
		options: {
			
		},
		targetTask: {

		}
	}
});
grunt.loadNpmTasks('grunt-transform-js');
```

## Options

####header
code header of generated script file if not configuration `shim`

####footer
code header of generated script file if not configuration `shim`

####shim
code shim, usage see example below


## Usage Examples
```js
grunt.initConfig({
transform: {
			/**
			 * use remote file as src
			 * format:
			 * ---------
			 * src: [remote file]
			 * dest: [dest]
			 * ---------
			 * or
			 * ---------
			 * [dest]: [remote file]
			 * ---------
			 * it look like operate local file that have not use 'expand'
			 * tips: additional properties cannot be specified if want to src form remote file
			 *
			 * use local file is the same as other grunt plugin
			 */
			jquery: {
				options: {
					header: 'define(function() {',
					footer: 'return $.noConflict(true);\n});'
				},
				files: [
					{
						//use remote file
						src: 'http://code.jquery.com/jquery-2.0.2.min.js',
						dest: 'tmp/jquery/2.0.2/jquery.js'
					},
					{
						//use local file
						src:'test/fixtures/src/jquery-1.10.1.min.js',
						dest:'tmp/jquery/1.10.1/jquery.js'
					}
				]
			},
			migrate: {
				options: {
					shim: function(code) {
						return [
							'define(function(require) {',
							'var jQuery = require("$");',
							code,
							'return $;',
							'});'
						].join('\n');
					}
				},
				src: 'http://code.jquery.com/jquery-migrate-1.2.1.js',
				dest: 'tmp/jquery-migrate/1.2.1/jquery-migrate.js'
			},
			underscore: {
				options: {
					shim: function(code) {
						return [
							'define(function() {',
							code,
							'return _.noConflict();',
							'});'
						].join('\n');
					}
				},
				src: 'http://underscorejs.org/underscore.js',
				dest: 'tmp/underscore/1.4.4/underscore.js'
			}
		}
	});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
2013.06.21 -- 0.1.5 -- first version

## License
Copyright (c) 2013 Aturan Tam
Licensed under the MIT license.
