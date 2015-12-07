module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
     build: {
       cwd: 'source',
       src: [ '**' ],
       dest: 'build',
       expand: true
     },
   },
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 20
      },
      source: {
        files: [{
          src: [
            'build/js/**/*.js',
            'build/css/**/*.css'
          ]
        }]
      }
    },
    useminPrepare: {
      html: 'source/index.html',
      options: {
        dest: 'build'
      }
    },
    usemin: {
      html: 'build/index.html',
      options: {
        assetsDirs: ['build',  'build/js/*.js',  'js']
      }
    },
    clean: {
		build: {
		src: [ 'build' ]
		},
	}
    	
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-filerev');

  grunt.registerTask('build', [
      'clean:build',
      'copy:build',
      'useminPrepare',
      'concat',
      'uglify',
      'cssmin',
      'filerev',
      'usemin'
  ]);
};

