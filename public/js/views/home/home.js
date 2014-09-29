define(function(require) {
  var Woodhouse = require('woodhouse');

  var LoginView = require('../user/login');
  var APP = require('../../constants');

  // Acts as a layout for multiple backbone views
  return Woodhouse.View.extend({
    initialize: function(options) {
      this.videos = options.videos;
      this.channels = options.channels;
      this.bindWindowEvents();
    },
    template: function(context) {
      return jade.render('home', _.extend(context, {
        user: APP.user && APP.user.toJSON()
      }));
    },
    
    onRender: function() {
    },

    openLoginModal: function() {
      this.$el.find('.login').html(new LoginView().render().$el);
      this.$el.find('.login-modal').modal('show');
    },

    logout: function() {
      APP.user = undefined;
      $.ajax('/v1/users/logout');
      this.render();
    },

    bindWindowEvents: function() {
      $(window).on(APP.EVENTS.USER_LOGIN, function(e, user) {
        setTimeout(function() {
          this.render();
        }.bind(this), 500);
      }.bind(this));
    }

  });
})
