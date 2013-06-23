var should = require('should');
global.config = require('../config.js');
var Evernote = require('evernode').Evernote;
var evernote = new Evernote(
	config.evernoteConsumerKey,
	config.evernoteConsumerSecret,
	config.evernoteUsedSandbox
);

var scheduler = require('../lib/templer');
var users = config;

describe("test entire", function() {
	before(function() {
	});



	after(function() {
	});
});


