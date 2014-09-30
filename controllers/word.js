var BaseCrudController = require('./base_crud');
var Word = require('../models/word');
var WordCollection = require('../collections/word');
var User = require('../models/user');

var authenticateMiddleware = require('./middlewares/authenticate');
var requireJsonMiddleware = require('./middlewares/require_json');
var requireUserMiddleware = require('./middlewares/require_user');
var requireAdminMiddleware = require('./middlewares/require_admin');

module.exports = BaseCrudController.extend({
	urlRoot: "words",
  model: Word,
  collection: WordCollection,

  setupRoutes: function() {
    var basePath = _.result(this, "basePath");

    this.routes.post[basePath + '/:id/save'] = {
      action: this.save,
      middleware: this.getRouteMiddleware('save')
    };

    BaseCrudController.prototype.setupRoutes.call(this);
  },


  // Middleware to require admin on create, update, and destroy
  middleware: function() {
    return {
      create: [authenticateMiddleware, requireJsonMiddleware, requireAdminMiddleware],
      find: [],
      findOne: [],
      update: [authenticateMiddleware, requireJsonMiddleware, requireAdminMiddleware],
      destroy: [authenticateMiddleware, requireAdminMiddleware],
      save: []
    };
  },

  find: function(req, res, next) {
  	// get words from the list that the user hasn't seen yet
  	var qo = this.parseQueryString(req);
    var collection = this.setupCollection(req, qo);

    delete qo.query.user_id;

    qo.skip = parseInt(Math.random() * 4000);


    if (true) {
      console.log("Find with Query: %s".verbose, JSON.stringify(qo));
    }
    
    return collection.fetch(qo).bind(this).then(function(resp) {
      return collection.count(qo).tap(function(resp) {
        res.paging = {
          total: parseInt(resp),
          count: parseInt(collection.models.length),
          limit: parseInt(qo.limit),
          offset: parseInt(qo.skip),
          has_more: parseInt(collection.models.length) < parseInt(resp)
        };
      });
    }).then(function(count) {
      return collection;
    }).then(this.nextThen(req, res, next))
    .catch(this.nextCatch(req, res, next));
  },

  save: function(req, res, next) {
    var model = this.setupModel(req);
    model.setFromRequest(req.body);

    return model.fetch()
      .then(function(model) {
        return model.incrementValues();
      })
      .then(function(models) {
        return model.fetch();
      })
      .then(this.nextThen(req, res, next))
      .catch(this.nextCatch(req, res, next));
  }

});
