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


####temp

Default: `false`

if this is true, the remote file will be cache(path is `.grunt/grunt-transform-js`)


####pkg

**only support remote model**

For `package.json` url, and can be used by `{propertyName}` in `src` or `dest`

```js
{
	underscore: {
		options: {
			pkg: 'http://underscorejs.org/package.json'
		},
		src: 'http://underscorejs.org/underscore.js',
		dest: 'tmp/underscore/{version}/underscore.js'
	}
}
```

## The local/remote model
if Local file exists in 'src', it will be called as local model, if not will be called as remote model.

If remote model, it is not support use 'expand', only support two field what 'src' and 'desc'.

'src' only support one type of model for local model or remote model.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History

2013.06.21 -- 0.1.5 -- first version

## License

Copyright (c) 2013 Aturan Tam

Licensed under the MIT license.
