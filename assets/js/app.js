define(['jquery', 'underscore', 'backbone', 'handlebars', 'libs/console', 'templates'], function($, _, Backbone) {
  var initialize;

  initialize = function() {
    var data;

    data = {
      title: 'Welcome to Backbone Template Engine.'
    };
    $('body').html(Handlebars.templates.index(data));
    return console.info(data.title);
  };
  return {
    initialize: initialize
  };
});
