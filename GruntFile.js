module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
        html: {
            command: 'cd docs; make clean; make html'
        },
        jscopy: {
            command: 'cp media/js/jquery.menuoptions.js ~/Data/SoftwareDev/MenuOptions/dist/js; cp media/js/jquery.menuoptions.js ~/Data/SoftwareDev/TherapyAutomation/web/js; cp media/js/jquery.menuoptions.min.js ~/Data/SoftwareDev/TherapyAutomation/web/js; cp media/js/jquery.menuoptions.min.js ~/Data/SoftwareDev/MenuOptions/dist/js;'

        }
    },
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
        tasks: [ 'jshint', 'uglify', 'exec:jscopy']
      },
      html: {
        files: ['docs/source/*.rst'], // which files to watch
        tasks: ['exec:html'],
        options: {
          nospawn: true
        }
      },
      cssmin: {
          files: [ 'media/css/menuoptions.css' ],
          tasks: ['cssmin'],
      },
    },
    cssmin: {
        minify: {
            src: 'media/css/menuoptions.css',
            dest: 'media/css/menuoptions.min.css'
        }
    }
  });
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['watch', 'jshint', 'uglify', 'cssmin']); 
};

