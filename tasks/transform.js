'use strict';
var request = require("request"),
	path = require("path"),
	fs = require('fs'),
	util = require('util'),
	EventProxy = require('eventproxy');

module.exports = function (grunt) {
	grunt.registerMultiTask('transform', 'grunt-transform-js', function () {
		//异步执行
		var done = this.async();
		var ep = new EventProxy();
		var options = this.options();
		//source code与transform info的分隔符

		var shim = typeof options.shim === 'function' ? options.shim : function(code) {
			var separator = grunt.util.normalizelf('\n');
			if (options.header === null || options.header === undefined) {
				options.header = '';
			}
			if (options.footer === null || options.footer === undefined) {
				options.footer = '';
			}
			return [options.header, code, options.footer].join(separator);
		};

		this.files.forEach(function (fileObj) {
			if (grunt.file.exists(fileObj.dest)) {
				ep.emitLater('error', util.format('dest file(%s) is exists...', fileObj.dest));
			}
			else if (fileObj.src == null || fileObj.src.length === 0) {
				var src = fileObj.orig.src;
				src = src && src[0];
				if (isRemoteFile(src)) {
					grunt.log.writeln('read remote file:' + src);
					readRemoteFile(src, ep.done(function (body) {
						ep.emit('transform', body, fileObj, src);
					}));
				}
				else {
					ep.emit('over', false);
				}
			}
			else {
				ep.emitLater('transform', grunt.file.read(fileObj.src[0]), fileObj, fileObj.src[0]);
			}
		}, this);

		ep.on('transform', function (body, fileObj, srcPath) {
			grunt.file.write(fileObj.dest, shim(body));
			grunt.log.write(util.format('%s => %s...', srcPath, fileObj.dest)).ok();
			ep.emit('over', true);
		});
		ep.on('error', function (err) {
			grunt.log.write(err + '...').error();
			ep.emit('over', false);
		});
		ep.after('over', this.files.length, function () {
			ep.unbind();
			done();
		});
	});
};
//helper
function isRemoteFile(filename) {
	return (/(?:file|https?):\/\/([a-z0-9\-]+\.)+[a-z0-9]{2,4}.*$/).test(filename);
}
function readRemoteFile(path, callback) {
	request(path, function (err, res, body) {
		if (!err && +res.statusCode === 200) {
			callback(null, body);
		}
		else {
			callback(util.format('read file(%s) error: %s', path, err));
		}
	});
}

