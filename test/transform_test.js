'use strict';
var grunt = require('grunt');
exports.transform = {
	setUp: function (done) {
		done();
	},
	jqeury: function (test) {
		test.expect(2);
		var scriptList = ['jquery/2.0.2/jquery.js', 'jquery/1.10.1/jquery.js'];
		scriptList.forEach(function(jsPath) {
			var path =require('path');
			var md5 = function(value) {
				var crypto = require('crypto');
				return crypto.createHash('md5').update(value).digest("hex");
			};
			var tmp = md5(grunt.file.read(path.resolve('tmp', jsPath)));
			var expected = md5(grunt.file.read(path.resolve('test/expected', jsPath)));
			test.equal(tmp, expected, 'transform error:' + jsPath);
		});
		test.done();
	}
};
