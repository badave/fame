var Base = require('./base');

module.exports = Base.extend({
  urlRoot: "words",

  db: Bootie.database.mongodbs.primary,

  schema: {
  	'word': 'string',
  	'known': 'number',
  	'unknown': 'number',
  	'total': 'number'
  },

  incrementValues: function() {
    // Build query against the model's id
    var query = {};
    query[this.idAttribute] = this.id;

    var updateObject = {};

    if(this.get('unknown')) {
      this.unset('unknown');
      updateObject = {
        '$inc': {
          'unknown': 1,
          'total': 1
        }
      };
    }

    if(this.get('known')) {
      this.unset('known');
     	updateObject = {
        '$inc': {
          'known': 1,
          'total': 1
        }
      };
    }

    return this.db.findAndModify(this.urlRoot, query, updateObject).return(this);
  }
});
