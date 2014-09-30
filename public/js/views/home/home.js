define(function(require) {
  var Woodhouse = require('woodhouse');

  var LoginView = require('../user/login');
  var APP = require('../../constants');
  var User = require('../../models/user');

  // Acts as a layout for multiple backbone views
  return Woodhouse.View.extend({
    initialize: function(options) {
      this.collection = options.collection;
      this.index = 0;
      this.model = this.collection.models[this.index];
      this.bindWindowEvents();
    },
    events: { 
      'click .center-portion': 'yes',
      'click .no': 'no',
      'touchend .center-portion': 'yes',
      'touchend .no': 'no'
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
      APP.user = new User();
      this.render();
      $.ajax('/v1/users/logout');
    },

    bindWindowEvents: function() {
      $(window).on(APP.EVENTS.USER_LOGIN, function(e, user) {
        setTimeout(function() {
          this.render();
        }.bind(this), 500);
      }.bind(this));
    },

    yes: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.model.set('known', true);

      this.$el.addClass('action-taken');

      this.model.saveResponse({}, {
        success: this.knownSuccessHandler.bind(this),
        error: this.responseErrorHandler.bind(this)
      });
    },

    no: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.model.set('unknown', true);
      this.$el.addClass('action-taken');
      this.model.saveResponse({}, {
        success: this.knownSuccessHandler.bind(this),
        error: this.responseErrorHandler.bind(this)
      });
    },

    knownSuccessHandler: function() {
      // remove this one from the pool
      this.collection.remove(this.model);
      // randomize
      this.index = _.random(0, this.collection.length - 1);
      // this should remove seen words as we go along
      this.model = this.collection.models[this.index];
      this.$el.removeClass('action-taken');
      this.render();

      // this fetch should bring in more and NOT reset the collection
      if(this.collection.length < 8) {
        this.collection.fetch({
          reset: false
        });
      }
    },

    responseErrorHandler: function() {
      console.log("Response Error: ", JSON.stringify(arguments));
    }

  });
})
