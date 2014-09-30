define(function(require) {
  var Promise = require('bluebird');
  var Woodhouse = require('woodhouse');

  var HomeView = require('./views/home/home');
  var WordCollection = require('./collections/word');

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
      var loadWords = function(done) {
        var words = new WordCollection();
        words.fetch({
          success: function(words) {
            done(null, words);
          },
          error: function(response) {
            console.error(response);
            setTimeout(function() {
              loadWords(done);  
            }, 200);
          }
        });
      }

      loadWords(function(error, words) {
        var view = new HomeView({
          collection: words
        });
        view.render();
        this.$el.html(view.$el);
      }.bind(this));
    }
  });

  return App;
});
