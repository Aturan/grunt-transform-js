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

####tmp
Default: `true`


if this is true, the remote file will be cache(path is `.grunt/grunt-transform-js`)


## Usage Examples
> see `Gruntfile.js`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
2013.06.21 -- 0.1.5 -- first version

## License
Copyright (c) 2013 Aturan Tam
Licensed under the MIT license.
