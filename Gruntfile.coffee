module.exports = (grunt) ->

    # Project configuration
    grunt.initConfig
        shell:
            init:
                command: 'test -d "assets/vendor" || bower install'
                options:
                    stdout: true
                    callback: (err, stdout, stderr, cb) ->
                        console.log('Install bower package compeletely.')
                        cb()
            build:
                command: 'node node_modules/requirejs/bin/r.js -o build/self.build.js'
                options:
                    stdout: true
        handlebars:
            options:
                namespace: 'Handlebars.templates'
                processName: (filename) ->
                    return filename.replace(/assets\/templates\/(.*)\.handlebars$/i, '$1')
            compile:
                files:
                    'assets/templates/template.js': ['assets/templates/*.handlebars']
        uglify:
            template:
                files:
                    'assets/templates/template.js': ['assets/templates/template.js']
        connect:
            server:
                options:
                    port: 9001
                    base: '.'

    # Dependencies
    grunt.loadNpmTasks 'grunt-shell'
    grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-contrib-handlebars'
    grunt.loadNpmTasks 'grunt-contrib-uglify'

    grunt.registerTask 'default', ['shell', 'handlebars', 'uglify', 'connect:server']