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
			var tmp = md5File('tmp', jsPath);
			var expected = md5File('test/expected', jsPath);
			test.equal(tmp, expected, 'transform error:' + jsPath);
		});
		test.done();
	},
	underscore: function(test) {
		test.expect(1);
		var jsPath = 'underscore/1.5.1/underscore.js';
		var tmp = md5File('tmp', jsPath);
		var expected = md5File('test/expected', jsPath);
		test.equal(tmp, expected, 'transform error:' + jsPath);
		test.done();
	}
};

function md5File() {
	var path = require('path');
	var filePath = path.resolve.apply(path, arguments);
	return md5(grunt.file.read(filePath));
}

function md5(value) {
	var crypto = require('crypto');
	return crypto.createHash('md5').update(value).digest("hex");
}
