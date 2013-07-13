module.exports = function (grunt) {
	'use strict';
	var request = require("request"),
		util = require('util');
	grunt.registerMultiTask('transform', 'grunt-transform-js', function () {
		var EventProxy = require('eventproxy');
		//异步执行
		var done = this.async();
		var ep = new EventProxy();
		var options = this.options({
			temp: false,
			pkg: ''
		});

		var separator = grunt.util.normalizelf('\n');

		var shim = typeof options.shim === 'function' ? options.shim : function(code) {
			if (options.header === null || options.header === undefined) {
				options.header = '';
			}
			if (options.footer === null || options.footer === undefined) {
				options.footer = '';
			}
			return [options.header, code, options.footer].join(separator);
		};

		this.files.forEach(function (fileObj) {
			var read = new EventProxy();
			var srcList = [], dest = fileObj.dest;

			//存在本地文件，则使用local model
			if (fileObj.src.length > 0) {
				grunt.log.verbose.writeln('use local model');
				srcList = fileObj.src;
				read.emitLater('get', srcList);
			}
			//否则使用remote model
			else {
				grunt.log.verbose.writeln('use remote model');
				srcList = fileObj.orig.src || [];

				if (isRemoteFile(options.pkg)) {
					grunt.log.write('Read package.json: ' + options.pkg + '...');
					var request = new EventProxy();
					asyncReadFile(options.pkg, request.doneLater('json'));
					request.on('json', function(json) {
						grunt.log.ok();
						try {
							json = JSON.parse(json);
						}
						catch (e) {
							json = {};
						}
						dest = template(dest, json);
						read.emit('parseTpl', srcList, json);
					});
					request.fail(function() {
						grunt.log.error();
						ep.emit('end', false);
					});
				}
				else {
					srcList = srcList.filter(function(src) {
						return isRemoteFile(src);
					});
					read.emitLater('get', srcList);
				}
			}

			read.on('parseTpl', function(srcList, json) {
				srcList = srcList.map(function(value) {
					return template(value, json);
				});
				read.emit('get', srcList);
			});

			read.on('get', function(srcList) {
				if (srcList.length === 0) {
					grunt.log.verbose.write('src is empty...').error();
					ep.emit('end', false);
				}
				else {
					srcList.forEach(function(src) {
						asyncReadFile(src, options.temp, read.group('transform', function(body) {
							grunt.log.verbose.write('GET: ' + src + '...').ok();
							return {src: src, code: shim(body, src)};
						}));
					});
				}
			});

			read.on('error', function(error) {
				grunt.log.verbose.write('GET: ' + error.path + '...').error();
				read.emit('request', {src: error.path, code: ''});
			});

			read.after('transform', srcList.length, function(data) {
				var body = data.reduce(function(preValue, value) {
					return preValue + ((value.code !== undefined && value.code !== null) ? value.code : '') + separator;
				}, '');
				var srcList = data.map(function(value) {
					return value.src;
				}).join(', ');
				grunt.log.write(srcList).write(' -> ' + dest + '...').ok();
				grunt.file.write(dest, body);
				ep.emit('end', true);
			});
		}, this);

		ep.after('end', this.files.length, function () {
			done();
		});

	});

	function isRemoteFile(filename) {
		return (/(?:file|https?):\/\/([a-z0-9\-]+\.)+[a-z0-9]{2,4}.*$/).test(filename);
	}

	//读取远程/本地文件
	function asyncReadFile(path, allowTemp, callback) {
		if (typeof allowTemp === 'function') {
			callback = allowTemp;
			allowTemp = false;
		}
		if (isRemoteFile(path)) {
			var crypto = require('crypto');
			var tmpPath = crypto.createHash('md5').update(path).digest('hex');
			tmpPath = '.grunt/grunt-transform-js/' + tmpPath;
			if (allowTemp && grunt.file.exists(tmpPath)) {
				callback(null, grunt.file.read(tmpPath));
			}
			else {
				request(path, function (err, res, body) {
					if (!err && +res.statusCode === 200) {
						allowTemp && grunt.file.write(tmpPath, body);
						callback(null, body);
					}
					else {
						callback({err: err, path: path});
					}
				});
			}
		}
		else {
			var body = grunt.file.read(path);
			callback(null, body);
		}
	}

	function template(tpl, data) {
		return tpl.replace(/\{([^\{\}]*)\}/g, function(code, expr) {
			try {
				expr = expr.split('.');
				var value = data[expr.shift()];
				while (expr.length > 0) {
					value = value[expr.shift()];
				}
				return value.toString();
			}
			catch (e) {
				return '';
			}
		});
	}
};
