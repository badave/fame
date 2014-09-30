define(function(require) {
	var BaseCollection = require('./base');
	var Word = require('../models/word');

	return BaseCollection.extend({
    urlRoot: '/v1/words',
    model: Word
  });
});
