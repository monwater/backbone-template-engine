define(['jquery', 'underscore', 'backbone', 'modernizr', 'handlebars', 'libs/console', 'templates'], function($, _, Backbone) {
  var initialize;
  initialize = function() {
    var data;
    data = {
      title: 'Welcome to Backbone Template Engine.'
    };
    $('body').html(Handlebars.templates.index(data));
    console.info(data.title);
    if (Modernizr.canvas) {
      console.info('Your browser support canvas');
    } else {
      console.warn('Your browser don\'t support canvas');
    }
    if (Modernizr.touch) {
      console.info('Your device support touch event');
    } else {
      console.warn('Your browser don\'t support canvas');
    }
    return null;
  };
  return {
    initialize: initialize
  };
});
