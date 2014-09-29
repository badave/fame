var Base = require('./base');

module.exports = Base.extend({
  urlRoot: "words",

  schema: {
  	'word': 'string',
  	'known': 'number',
  	'unknown': 'number',
  	'total': 'number'
  }
});
