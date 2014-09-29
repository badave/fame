define(function(require) {
  var Promise = require('bluebird');
  var Woodhouse = require('woodhouse');

  var HomeView = require('./views/home/home');

  var App = Woodhouse.Router.extend({
    initialize: function() {
      Backbone.history.start();
    },
    routes: {
      "": "index",
      "/": "index"
    },

    index: function() {
      debugger
    }
  });

  return App;
});
