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
			/**
			 * use remote file as src
			 * format:
			 * ```
			 * src: [remote file]
			 * dest: [dest]
			 * ```
			 * or
			 * ```
			 * [dest]: [remote file]
			 * ```
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
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.registerTask('test', ['jshint', 'clean', 'transform', 'nodeunit']);
	grunt.registerTask('default', ['clean', 'transform']);
};
