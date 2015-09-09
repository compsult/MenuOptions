module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      development: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
            "media/js/jquery.menuoptions.min.js" : [ "media/js/jquery.menuoptions.js" ]
        }
      }
    },
    jshint: {
        all: {
             src: "media/js/jquery.menuoptions.js"
        }
    },
    watch: {
      jshint: {
        files: ['media/js/jquery.menuoptions.js'], // which files to watch
        tasks: [ 'jshint', 'uglify']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['watch', 'jshint', 'uglify']); 
};
