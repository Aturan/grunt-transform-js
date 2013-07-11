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
			tests: ['tmp']
		},
		nodeunit: {
			tests: ['test/*_test.js']
		},
		transform: {
			/**
			 * About files format, if in remote model(src is remote file), it is not support use 'expand',
			 * and only support two field what 'src' and 'desc'
			 */
			jquery: {
				options: {
					header: 'define(function() {',
					footer: 'return $.noConflict(true);\n});'
				},
				files: [
					{
						//use remote file
						src: ['test/fixtures/jquery-1.10.1.min.js'],
						dest: 'tmp/jquery/2.0.2/'
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
	grunt.registerTask('default', ['clean', 'transform:jquery']);
};
