define(function(require) {
	var _ = require('underscore');
	return _.extend(_.prototype, { 
		log: function() {
			console.log(arguments);

			// Add other stuff here
		}
	});
});
