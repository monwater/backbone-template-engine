module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      bower: {
        command: 'node node_modules/.bin/bower install',
        options: {
          stdout: true,
          callback: function(err, stdout, stderr, cb) {
            console.log('Install bower package compeletely.');
            return cb();
          }
        }
      },
      build: {
        command: 'node node_modules/requirejs/bin/r.js -o build/self.build.js',
        options: {
          stdout: true
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
    uglify: {
      template: {
        files: {
          'assets/templates/template.js': ['assets/templates/template.js']
        }
      }
    },
    connect: {
      livereload: {
        options: {
          hostname: '0.0.0.0',
          port: 9001,
          base: '.'
        }
      }
    },
    regarde: {
      scss: {
        files: ['**/*.scss'],
        tasks: ['compass'],
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
      dist: {
        options: {
          config: 'assets/config.rb',
          sassDir: 'assets/sass',
          cssDir: 'assets/css'
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
    return grunt.file.exists('assets/vendor') || grunt.task.run('shell:bower');
  });
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  return grunt.registerTask('default', ['init', 'handlebars', 'uglify', 'shell:build', 'livereload-start', 'connect', 'regarde']);
};
