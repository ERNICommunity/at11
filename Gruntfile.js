module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: [
				"package.jon",
				"*.js",
				"parsers/**/*.js",
				"test/**/*.js"				
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');	
	
	grunt.registerTask('default', ['jshint']);
};