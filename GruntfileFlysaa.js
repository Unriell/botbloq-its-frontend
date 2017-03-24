// Generated on 2015-06-03 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    tmp: '.tmp',
    port: '8000',
    hostname: 'localhost'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/assets/js/{,*/}*.js'],
        tasks: ['copy:liferayjs','copy:liferayvoyagerjs'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      assemble: {
        files: ['<%= yeoman.app %>/templates/**/*.hbs', '<%= yeoman.app %>/templates/**/*.json'],
        tasks: ['assemble']
      },
      compass: {
        files: [
          '<%= yeoman.app %>/sass/{,*/}*.{scss,sass}',
          '<%= yeoman.app %>/sass/modules/{,*/}*.{scss,sass}',
          '<%= yeoman.app %>/sass/extra/images/{,*/}*.{png}'
        ],
        tasks: ['compass:server','csscount:server','copy:liferaycss','copy:liferayvoyagercss']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.tmp %>/assets/css/{,*/}*.css',
          '<%= yeoman.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: '<%= yeoman.port %>',
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '<%= yeoman.hostname %>',
        livereload: 35729
      },
      livereload: {
        options: {
          base: ['app'],
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
          options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/assets/js/{,*/}*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.tmp %>',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '<%= yeoman.tmp %>'
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/sass',
        cssDir: '<%= yeoman.tmp %>/assets/css',
        generatedImagesDir: '<%= yeoman.tmp %>/assets/css/img',
        imagesDir: '<%= yeoman.app %>/sass/extra/images',
        importPath: './bower_components',
        httpImagesPath: '/assets/css/img',
        httpGeneratedImagesPath: 'img',
        httpFontsPath: 'fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n',
        outputStyle: 'compressed'

      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/assets/css/img'
        }
      },
      server: {
        options: {
          sourcemap: false
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/assets/js/{,*/}*.js',
          '<%= yeoman.dist %>/assets/css/{,*/}*.css',
          '<%= yeoman.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/assets/css/fonts/*',
          '<%= yeoman.dist %>/assets/css/img/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/home.html',
      options: {
        dest: '<%= yeoman.dist %>'//,
        //flow: {
//          html: {
//            steps: {
//              js: ['concat', 'uglifyjs'],
//              css: ['cssmin']
//            },
//            post: {}
//          }
//        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/assets/css/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/assets/images',
          '<%= yeoman.dist %>/assets/css'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    cssmin: {
       dist: {
         files: {
           '<%= yeoman.dist %>/styles/main.css': [
             '.tmp/styles/{,*/}*.css'
           ]
         }
       }
     },
    concat: {
        dist: {
          files: [
            {
              //dest: 'dist/assets/js/prod/flysaa.min.js',
              // src: 'dist/assets/js/*.js'
              '<%= yeoman.dist %>/assets/js/prod/flysaa.min.js': ['<%= yeoman.dist %>/assets/js/*.js'],
              '<%= yeoman.dist %>/assets/css/prod/flysaa.min.css': ['<%= yeoman.dist %>/assets/css/flysaa-vendor.css','<%= yeoman.dist %>/assets/css/flysaa-bootstrap.min.css','<%= yeoman.dist %>/assets/css/flysaa.min.css','<%= yeoman.dist %>/assets/css/flysaa-airways.min.css']
            }
          ]
        }
    },
    uglify: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.dist %>/assets/js/prod',
                src: '{,*/}*.js',
                dest: '<%= yeoman.dist %>/assets/js/prod'
            }]
        },
        options: {
            mangle: false
        }
    },

     imagemin: {
      options:{
        optimizationLevel:6
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/assets/images'
        }]
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      liferaycss: {
        expand: true,
        cwd: '<%= yeoman.tmp %>/assets/css',
        dest: 'C:/Liferay/liferay-portal-6.2-ce-ga4/tomcat-7.0.42/webapps/saa-airways-theme/airways/css',
        src: '{,*/}*.css'
      },
      liferayjs: {
        expand: true,
        cwd: '<%= yeoman.app %>/assets/js',
        dest: 'C:/Liferay/liferay-portal-6.2-ce-ga4/tomcat-7.0.42/webapps/saa-airways-theme/airways/js',
        src: '{,*/}*.js'
      },
      liferayvoyagercss: {
        expand: true,
        cwd: '<%= yeoman.tmp %>/assets/css',
        dest: 'C:/Liferay/liferay-portal-6.2-ce-ga4/tomcat-7.0.42/webapps/saa-airways-theme/voyager/css',
        src: '{,*/}*.css'
      },
      liferayvoyagerjs: {
        expand: true,
        cwd: '<%= yeoman.app %>/assets/js',
        dest: 'C:/Liferay/liferay-portal-6.2-ce-ga4/tomcat-7.0.42/webapps/saa-airways-theme/voyager/js',
        src: '{,*/}*.js'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      dist: [
        'compass:dist'
      ]
    },

    assemble: {
      options: {
        prettify: {
          indent: 2
        },
        marked: {
          sanitize: false
        },
        production: true,
        flatten: true,
        layoutdir: 'app/templates/layouts',
        layout: 'app-main.hbs',
        data: 'app/templates/data/*.json',
        partials: [
          'app/templates/modules/**/*.hbs',
          'app/templates/partials/**/*.hbs'
        ]

      },
      pages: {
        files: [
          {
            expand: true,
            cwd: 'app/templates/pages',
            src: ['*.hbs'],
            dest: 'app',
            ext: '.html'
          }
        ]
      },
      voyager: {
        options: {
          layout: 'app-main-voyager.hbs',
          data: 'app/templates/data/voyager/*.json',
        },
        files:[
          {
            expand: true,
            cwd: 'app/templates/pages/voyager',
            src: ['*.hbs'],
            dest: 'app',
            ext: '.html'
          }
        ]
      }

//      onbiz: {
//        files: [{
//          expand: true,
//          cwd: 'app/templates/pages/onbiz',
//          src: ['*.hbs'],
//          dest: 'app',
//          ext: '.html'
//       }]
//     }

    },
    csscount: {
      options: {
        maxSelectors: 4096
      },
      server: {
        src: [
          '<%= yeoman.tmp %>/assets/css/*.css'
        ]
      },
      dist: {
        src: [
          '<%= yeoman.dist %>/assets/css/*.css'
        ]
      }

    }

  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'assemble',
      'concurrent:server',
      'connect:livereload',
      'csscount:server',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });


  grunt.registerTask('prod', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat:generated',
    'copy:dist',
    //'imagemin:dist',
    'cssmin',
    'uglify:generated',
    //'filerev',
    'usemin',
    'concat:dist',
    'uglify:dist',
    'csscount:dist'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat:generated',
    'copy:dist',
    //'imagemin:dist',
    'cssmin',
    'uglify:generated',
    //'filerev',
    'usemin',
    'csscount:dist'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'build'
  ]);
};
