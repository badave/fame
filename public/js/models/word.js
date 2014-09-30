define(function(require) {
	var Woodhouse = require('woodhouse');

  return Woodhouse.Model.extend({
  	idAttribute: "_id",

    urlRoot: '/v1/words',
    url: function() {
    	return this.id ? this.urlRoot + "/" + this.id: this.urlRoot;
    },

    saveResponse: function() {
    	var options = arguments[1];
    	options.method = "post";
    	options.url = this.url() + '/save';
    	arguments[1] = options;
    	this.save.apply(this, arguments);
    }
  });
});
