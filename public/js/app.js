define(function(require) {
  var Promise = require('bluebird');
  var Woodhouse = require('woodhouse');

  var HomeView = require('./views/home/home');

  var App = Woodhouse.Router.extend({
    $el: $("body"),
    initialize: function() {
      Backbone.history.start();
    },
    routes: {
      "": "index",
      "/": "index"
    },

    // Normal place to start is home
    index: function() {
      var view = new HomeView();
      view.render();
      this.$el.html(view.$el);
    }
  });

  return App;
});
