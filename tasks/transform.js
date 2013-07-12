'use strict';
var request = require("request"),
	util = require('util');

module.exports = function (grunt) {
	grunt.registerMultiTask('transform', 'grunt-transform-js', function () {
		var EventProxy = require('eventproxy');
		//异步执行
		var done = this.async();
		var ep = new EventProxy();
		var options = this.options({
			force: true
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
			var srcList = [];

			//存在本地文件，则使用local model
			if (fileObj.src.length > 0) {
				grunt.log.verbose.writeln('use local model');
				srcList = fileObj.src;
			}
			//否则使用remote model
			else {
				grunt.log.verbose.writeln('use remote model');
				srcList = fileObj.orig.src || [];
				srcList = srcList.filter(function(src) {
					return isRemoteFile(src);
				});
			}

			if (srcList.length === 0) {
				grunt.log.verbose.write('src is empty...').error();
				ep.emit('end', false);
			}
			else {
				setTimeout(function() {
					srcList.forEach(function(src) {
							asyncReadFile(src, !options.force, read.group('transform', function(body) {
								grunt.log.verbose.write('GET: ' + src + '...').ok();
								return {src: src, code: shim(body, src)};
							}));
					});
				}, 0);
			}

			read.on('error', function(error) {
				grunt.log.verbose.write('GET: ' + error.path + '...').error();
				read.emit('request', {src: error.path, code: ''});
			});

			read.after('transform', srcList.length, function(data) {
				var body = data.reduce(function(preValue, value) {
					return preValue + separator + ((value.code !== undefined && value.code !== null) ? value.code : '');
				}, '');
				var srcList = data.map(function(value) {
					return value.src;
				}).join(', ');
				grunt.log.write(srcList).write(' -> ' + fileObj.dest + '...').ok();
				grunt.file.write(fileObj.dest, body);
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
	function asyncReadFile(path, tmp, callback) {
		if (isRemoteFile(path)) {
			var crypto = require('crypto');
			var tmpPath = crypto.createHash('md5').update(path).digest('hex');
			tmpPath = '.grunt/grunt-transform-js/' + tmpPath;
			if (tmp && grunt.file.exists(tmpPath)) {
				callback(null, grunt.file.read(tmpPath));
			}
			else {
				request(path, function (err, res, body) {
					if (!err && +res.statusCode === 200) {
						tmp && grunt.file.write(tmpPath, body);
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

};
