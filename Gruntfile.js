module.exports = function(grunt) {
  var filetime;

  filetime = Date.now();
  grunt.initConfig({
    shell: {
      bower: {
        command: 'node node_modules/.bin/bower install',
        options: {
          stdout: true,
          stderr: true,
          callback: function(err, stdout, stderr, cb) {
            console.log('Install bower package compeletely.');
            return cb();
          }
        }
      },
      template: {
        command: 'node node_modules/.bin/handlebars assets/templates/*.handlebars -m -f assets/templates/template.js -k each -k if -k unless',
        options: {
          stdout: true,
          stderr: true
        }
      },
      build: {
        command: 'node node_modules/requirejs/bin/r.js -o build/self.build.js',
        options: {
          stdout: true,
          stderr: true
        }
      },
      release: {
        command: 'node node_modules/requirejs/bin/r.js -o build/app.build.js',
        options: {
          stdout: true,
          stderr: true
        }
      }
    },
    handlebars: {
      options: {
        namespace: 'Handlebars.templates',
        processName: function(filename) {
          return filename.replace(/assets\/templates\/(.*)\.handlebars$/i, '$1');
        }
      },
      compile: {
        files: {
          'assets/templates/template.js': ['assets/templates/*.handlebars']
        }
      }
    },
    connect: {
      livereload: {
        options: {
          port: 9001,
          base: '.'
        }
      }
    },
    regarde: {
      html: {
        files: ['**/*.html', '**/*.htm'],
        tasks: ['livereload'],
        events: true
      },
      scss: {
        files: ['**/*.scss'],
        tasks: ['compass:dev'],
        events: true
      },
      css: {
        files: ['**/*.css'],
        tasks: ['livereload'],
        events: true
      },
      js: {
        files: '**/*.js',
        tasks: ['livereload'],
        events: true
      },
      coffee: {
        files: '**/*.coffee',
        tasks: ['coffee'],
        events: true
      },
      handlebars: {
        files: '**/*.handlebars',
        tasks: ['handlebars', 'livereload'],
        events: true
      }
    },
    compass: {
      dev: {
        options: {
          basePath: 'assets',
          config: 'assets/config.rb'
        }
      },
      release: {
        options: {
          force: true,
          basePath: 'output/assets',
          config: 'output/assets/config.rb',
          outputStyle: 'compressed',
          environment: 'production'
        }
      }
    },
    coffee: {
      app: {
        expand: true,
        cwd: 'assets/coffeescript/',
        src: ['**/*.coffee'],
        dest: 'assets/js/',
        ext: '.js',
        options: {
          bare: true
        }
      },
      grunt: {
        files: {
          'Gruntfile.js': 'Gruntfile.coffee'
        },
        options: {
          bare: true
        }
      }
    },
    clean: {
      options: {
        force: true
      },
      js: 'output/assets/js',
      release: ['output/package.json', 'output/build.txt', 'output/component.json', 'output/Makefile', 'output/README.mkd', 'output/build', 'output/assets/coffeescript', 'output/assets/sass', 'output/assets/config.rb', 'output/assets/vendor', 'output/assets/templates', 'output/Gruntfile*'],
      cleanup: ['output', 'assets/vendor', 'assets/templates/template.js', 'assets/js/main-built.js', 'assets/js/main-built.js.map', 'assets/js/main-built.js.src', 'node_modules']
    },
    copy: {
      release: {
        files: [
          {
            src: '.htaccess',
            dest: 'output/'
          }, {
            src: 'output/assets/vendor/requirejs/require.js',
            dest: 'output/assets/js/require.js'
          }, {
            src: 'assets/js/main-built.js',
            dest: 'output/assets/js/' + filetime + '.js'
          }
        ]
      }
    },
    replace: {
      release: {
        src: 'output/index.html',
        dest: 'output/index.html',
        replacements: [
          {
            from: 'js/main',
            to: 'js/' + filetime
          }, {
            from: 'vendor/requirejs/',
            to: 'js/'
          }
        ]
      }
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      dev: {
        expand: true,
        cwd: 'assets/templates/',
        src: ['**/*.handlebars'],
        dest: 'assets/templates/',
        ext: '.handlebars'
      },
      index: {
        files: {
          'output/index.html': 'index.html'
        }
      },
      release: {
        expand: true,
        cwd: 'output/assets/templates/',
        src: ['**/*.handlebars'],
        dest: 'output/assets/templates/',
        ext: '.handlebars'
      }
    }
  });
  grunt.event.on('watch', function(action, filepath) {
    return grunt.log.writeln(filepath + ' has ' + action);
  });
  grunt.event.on('regarde:file', function(status, name, filepath, tasks, spawn) {
    return grunt.log.writeln('File ' + filepath + ' ' + status + '. Tasks: ' + tasks);
  });
  grunt.registerTask('init', function() {
    grunt.log.writeln('Initial project');
    return (grunt.file.exists('assets/vendor')) || grunt.task.run('shell:bower');
  });
  grunt.registerTask('release', function() {
    grunt.log.writeln('deploy project');
    (grunt.file.exists('assets/vendor')) || grunt.task.run('shell:bower');
    grunt.task.run(['shell:template', 'shell:build', 'shell:release', 'compass:release', 'clean:js']);
    grunt.file.mkdir('output/assets/js');
    grunt.task.run('copy:release');
    grunt.task.run(['htmlmin:release', 'htmlmin:index']);
    grunt.task.run('replace:release');
    return grunt.task.run('clean:release');
  });
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  return grunt.registerTask('default', ['init', 'handlebars', 'livereload-start', 'connect', 'regarde']);
};
