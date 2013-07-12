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
			tests: ['tmp'],
			tmp: ['.grunt']
		},
		nodeunit: {
			tests: ['test/*_test.js']
		},
		transform: {
			/**
			 * if Local file exists in 'src', it will be called as local model, if not will be called as remote model.
			 * If remote model, it is not support use 'expand', only support two field what 'src' and 'desc'.
			 * 'src' only support one model of local model and remote model.
			 */
			jquery: {
				options: {
					force: false,
					header: 'define(function() {',
					footer: 'return $.noConflict(true);\n});'
				},
				files: [
					{
						//use remote file
						src: ['http://code.jquery.com/jquery-2.0.2.min.js'],
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
	grunt.registerTask('default', ['clean:tmp', 'transform:jquery']);
};
