var Word = require('../models/word');

module.exports = Bootie.Collection.extend({
  model: Word,
  db: Bootie.database.mongodbs.primary
});
