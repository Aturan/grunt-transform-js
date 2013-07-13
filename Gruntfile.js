"use strict";

module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>']
		},
		clean: {
			tests: ['tmp', '.grunt']
		},
		nodeunit: {
			tests: ['test/*_test.js']
		},
		transform: {
			jquery: {
				options: {
					temp: true,
					header: 'define(function() {',
					footer: 'return $.noConflict(true);\n});'
				},
				files: [
					{
						//use remote file
						src: ['http://code.jquery.com/jquery-2.0.2.js', 'http://code.jquery.com/jquery-migrate-1.2.1.js'],
						dest: 'tmp/jquery/2.0.2/jquery.js'
					},
					{
						//use local file
						src: ['test/fixtures/jquery-1.10.1.js', 'test/fixtures/jquery-migrate-1.2.1.js'],
						dest: 'tmp/jquery/1.10.1/jquery.js'
					}
				]
			},
			underscore: {
				options: {
					pkg: 'https://raw.github.com/jashkenas/underscore/1.5.1/package.json',
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
				dest: 'tmp/underscore/{version}/underscore.js'
			}
		}
	});
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.registerTask('test', ['jshint', 'clean', 'transform', 'nodeunit']);
	grunt.registerTask('default', ['clean', 'transform']);
};
