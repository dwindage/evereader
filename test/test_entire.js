var should = require('should');
global.config = require('../config.js');
var Evernote = require('evernode').Evernote;
var evernote = new Evernote(
	config.evernoteConsumerKey,
	config.evernoteConsumerSecret,
	config.evernoteUsedSandbox
);

var evereader = require('../lib/evereader');
var users = config;

describe("test entire", function() {

	var user_token = '';
	var rss_feed_url_list = [];
	var rss_feed_data_list = [];

	before(function() {
		user_token = users.valid_token;
//		user_token = users.empty_notebook_token;
	});

	it("get url list: ", function(done) {
		evereader.get_url_list(user_token, function(err, url_list) {
			url_list.forEach(function(url) {
				rss_feed_url_list.push(url);
			});
			if(rss_feed_url_list.length > 0)
				console.log(rss_feed_url_list);
			rss_feed_url_list.length.should.be.within(0,1000);
			done();
		});
	});

	it("parse feed", function(done) {
		rss_feed_url_list.forEach(function(url) {
			evereader.parse(url, function(err, arr) {
				if(err) {
					console.log('error name : ' + err.name);
				} else if (arr) {
					arr.forEach( function(obj) {
						console.log('article title : ' + obj.title);
						rss_feed_data_list.push(obj);
					});
				}
			});
		});
		setTimeout( function(){ done(); }, 2000 );
	});

	it("insert note", function(done) {
		rss_feed_data_list.forEach( function(feed_data) {
			evereader.insert(user_token, feed_data, function(err, status_code) {
				if(err) console.log('error name : ' + err.name);
				else {
					console.log('insert status : ' + status_code);
				}
			});
		});
		setTimeout( function(){ done(); }, 5000 );
	});

	after(function() {
	});
});


