module.exports = function( grunt ) {

  grunt.initConfig({

    uglify : {
      options : {
        mangle : false
      },

      build_minify : {
        files : {
          'dist/palette.min.js' : [ 'src/js/palette.js', 'node_modules/tinycolor2/tinycolor.js' ]
        }
      },
      build : {
        options: {
          beautify: true
        },
        files : {
          'dist/palette.js' : [ 'src/js/palette.js', 'node_modules/tinycolor2/tinycolor.js' ]
     	}
      }
    }

  });


  // Plugins do Grunt
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );


  // Tarefas que serão executadas
  grunt.registerTask( 'default', [ 'uglify' ] );

};
