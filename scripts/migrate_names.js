var _ = global._ = require('lodash');
var config = global.config = require('../config');
var Bootie = global.Bootie = require('bootie');
var fs = require('fs');

var async = require('async');

var database = new Bootie.Database(config.database);
Bootie.database = database;

var WordCollection = require('../collections/word');
var Word = require('../models/word');

var collection = new WordCollection();

fs.readFile(__dirname + '/../data/celebrities.txt', function(err, names) {
	if(err) {
		console.log(err);
		return;
	}

	names = names.toString().split(/\n/);

	var fns = [];
	_.each(names, function(name) {
		fns.push(function(done) {
			// fetch collection for each name
			return collection.fetch({
				query: { 
					'word': name
				}
			}).then(function(collection) {
				if(collection.length) {
					console.log("Word already created", name);
					done(null, collection);
				} else {
					var word = new Word({
						word: name
					});

					return word.save()
						.then(function(model) {
							console.log("Word created: ", word.get('word'));
							collection.push(model);
							done(null, word);
						});
				}
			}).catch(function(e) {
				console.log('Error processing word: ', e);
				// does not have word do something

				done(e);
			});
		});
	});

	async.parallelLimit(fns, 100, function(err, data) {
		console.log("Completed");
		// console.log(err);
		// console.log(data);
	});
});
