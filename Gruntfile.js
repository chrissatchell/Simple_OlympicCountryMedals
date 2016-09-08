// Gruntfile.js
module.exports = grunt => {
  // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    // Task - Compile Sass to CSS
  	sass: {
      dist: {
      	options: {
      		sourceMap: true,
      		outputStyle: 'compressed'
      	},
        files: {
          'style.css': 'components/scss/style.scss'
        }
      },
      dev: {
        options: {
          sourceMap: true,
          outputStyle: 'compact'
        },
        files: {
          'style.css': 'components/scss/style.scss'
        }
      }
    },
    // Task - Babel transpile ES6
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          //'bundle.js': 'main.js'
          'bundle.js':'components/js/main.js'
        }
      }
    },
    // Task - Road browser and do other stuff
    watch: {
      options: {
        livereload: true, // Turn on live reload. Set to 'true'
        spawn: false // Adding 'spawn: false' is suppose to increase realod speed... I dunno
      },
      html: {
        files: ['*.html'] // Watch all html files
      },
      scss: {
        files: ['**/*.scss','**/*.css'], // Watch all sass (scss) and css files
        tasks: ['sass:dev']
      },
      js: {
        files: ['components/js/**/*.js'], // Watch all js files
        tasks: ['babel']
      }
    },
    // Task - Server
    connect: {
      server: {
        options: {
          port: 8888,
          keepalive: true
          // port: 9001,
          // base: 'www-root'
        }
      }
    }
  });

  grunt.registerTask('default', 'watch');
  // grunt.registerTask('server', 'connect:keepalive');
};
