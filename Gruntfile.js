module.exports = function( grunt ) {

  grunt.initConfig({

    uglify : {
      options : {
        mangle : false
      },
      build_minify : {
        files : {
          'dist/palette.min.js' : [ 'src/js/palette.js', 'node_modules/tinycolor2/tinycolor.js']
        }
      },
      build : {
        options: {
          beautify: true
        },
        files : {
          'dist/palette.js' : [ 'src/js/palette.js', 'node_modules/tinycolor2/tinycolor.js']
     	}
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1,
      },
      target: {
        files: {
          'dist/palette.min.css': ['src/css/palette.css']
        }
      }
    },
    
    concat: {
        dist: {
          files: {
            'dist/palette.css' : ['src/css/palette.css']
          }
        }
    },

    watch: {
      css: {
        files: ['src/css/*.css'],
        tasks: ['concat', 'cssmin']
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['uglify:build']
      }
    }

  });

  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask( 'default', [ 'uglify', "cssmin", "concat"] );

};
