# Filename: main.js
require.config
    paths:
        jquery: '../vendor/jquery/jquery'
        underscore: '../vendor/underscore-amd/underscore'
        backbone: '../vendor/backbone-amd/backbone'
        handlebars: '../vendor/handlebars/handlebars.runtime'
        templates: '../templates/template'
    shim:
        'templates': 'handlebars'
    # for development
    urlArgs: (new Date()).getTime()

require ['app'], (App) ->
    App.initialize()
