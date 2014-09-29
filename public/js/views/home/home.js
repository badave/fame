define(function(require) {
  var Woodhouse = require('woodhouse');

  var LoginView = require('../user/login');
  var APP = require('../../constants');
  var User = require('../../models/user');

  var WordsCollection = Woodhouse.Collection;

  var words = new WordsCollection([{
    word: 'Michael Jordan'
  }, {
    word: 'Abraham Lincoln'
  }, {
    word: 'Gregory House'
  }, {
    word: 'Barrack Obama'
  }]);

  // Acts as a layout for multiple backbone views
  return Woodhouse.View.extend({
    initialize: function(options) {
      this.bindWindowEvents();
    },
    events: { 
      'click .center-portion': 'yes',
      'click .no': 'no',
      'touchend .center-portion': 'yes',
      'touchend .no': 'no'
    },
    templateContext: function() {
      return {
        word: words.first().toJSON()
      }
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
      $.ajax('/v1/users/logout');
      this.render();
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
      this.known('yes');
    },

    no: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.known('no');
    },

    known: function(type) {
      console.log("type", type);
      $.ajax({
        url: '/v1/known',
        method: 'POST',
        dataType: 'json',
        data: {
          type: type,
          word: words.first().toJSON()
        },
        success: this.knownSuccessHandler.bind(this),
        error: this.responseErrorHandler.bind(this)
      });
    },

    knownSuccessHandler: function() {
      console.log("response");
    },

    responseErrorHandler: function() {
      console.log("Response Error: ", JSON.stringify(arguments));
    }

  });
})
