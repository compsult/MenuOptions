module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
        combine: {
            command: './combine_files.py _jquery.menuoptions.js'
        },
        css: {
            command: 'cp ./media/css/menuoptions.* ./dist/css/; cp ./media/imgs/* ./dist/imgs/'
        },
        html: {
            command: 'cd docs; make clean; make html'
        },
        examples: {
            command: './addCodeSegment.py'
        },
    },
    uglify: {
      development: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
            "dist/js/jquery.menuoptions.min.js" : [ "dist/js/jquery.menuoptions.js" ]
        }
      }
    },
    jshint: {
        options: {
            globals: {
                jQuery: true,
                console: true,
                alert: true,
                setTimeout: true,
                document: true
            }
        },
        all: {
             src: "dist/js/jquery.menuoptions.js"
        }
    },
    watch: {
      examples: {
        files: ['examples/*_test.html'], // which files to watch
        tasks: [ 'exec:examples']
      },
      jshint: {
        files: ['media/js/*.js'], // which files to watch
        tasks: [ 'exec:combine', 'jshint', 'uglify']
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
          tasks: ['cssmin', 'exec:css'],
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

