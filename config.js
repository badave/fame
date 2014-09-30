var environment = process.env['NODE_ENV'] || "development";
var fs = require('fs');
var path = require('path');


var config = module.exports = {
  proc: 'APP',
  pid: process.pid,
  env: environment,
  cachebust: (new Date()).getTime() // timestamp when process was started
};

config.title = "Fame";

config.database = {
  "mongodbs": {
    "primary": process.env['MONGOLAB_URI'] || "mongodb://heroku_app30150485:s8rvvqlnesnjkeaujnmnn5dcph@ds041150.mongolab.com:41150/heroku_app30150485",
  }
};

config.database.mongodbs.primary = "mongodb://heroku_app30150485:s8rvvqlnesnjkeaujnmnn5dcph@ds041150.mongolab.com:41150/heroku_app30150485";

if (environment === "development") {
  if (process.env['LOCALDB']) {
    config.database.mongodbs.primary = "mongodb://localhost:27017/fame";
  }
}

module.exports = config;
