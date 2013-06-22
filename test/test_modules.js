var should = require('should');
global.config = require('../config.js');
var Evernote = require('evernode').Evernote;
var evernote = new Evernote(
	config.evernoteConsumerKey,
	config.evernoteConsumerSecret,
	config.evernoteUsedSandbox
);

var scheduler = require('../lib/templer');
var users = {
  valid_token: 'S=s1:U=6bb76:E=146bcbcbd3d:C=13f650b913f:P=185:A=kjs8469-6024:V=2:H=78e08bfd670411cd73320735957392ff',
  empty_note_token: 'S=s1:U=6e34a:E=146c4e05120:C=13f6d2f2523:P=185:A=kjs8469-7232:V=2:H=3461a44efc15250c204e439ae9454ce4',
  empty_notebook_token: 'S=s1:U=6e83f:E=146c4e67701:C=13f6d354b04:P=185:A=kjs8469-7232:V=2:H=6754be998c51dda79b210e8a5b366561',
  invalid_token: 'S=s1:U=:E='
};

describe("test scheduler", function() {
	before(function() {
	});

	it("get url list: ", function(done) {
    scheduler.get_url_list(users.valid_token, function(err, url_list) {
      should.not.exist(err);
      url_list.length.should.equal(2);
      url_list.forEach(function(url) {
        url.should.match(/^http/);
        url.should.be.a('string'); 
        url.length.should.not.equal(0);
      });
      done();
    })       
	});
	it("get url list: no evereader note", function(done) {
    scheduler.get_url_list(users.empty_note_token, function(err, url_list) {
      should.exist(err);
      url_list.length.should.equal(0);
      url_list.forEach(function(url) {
        url.should.be.a('string'); 
        url.length.should.not.equal(0);
      });
      done();
    })       
	});
	it("get url list: nothing", function(done) {
    scheduler.get_url_list(users.empty_notebook_token, function(err, url_list) {
      should.exist(err);
      url_list.length.should.equal(0);
      url_list.forEach(function(url) {
        url.should.be.a('string'); 
        url.length.should.not.equal(0);
      });
      done();
    })       
	});
	it("get url list: invalid", function(done) {
    scheduler.get_url_list(users.empty_notebook_token, function(err, url_list) {
      should.exist(err);
      url_list.length.should.equal(0);
      url_list.forEach(function(url) {
        url.should.be.a('string'); 
        url.length.should.not.equal(0);
      });
      done();
    })       
	});

	it("parse feed", function(done) {
    scheduler.parse('http://bwhyuk.tumblr.com/rss', function(err, arr) {
      arr.forEach(function(obj) {
        obj.should.have.property('title');
        obj.should.have.property('description');
        obj.should.have.property('author');
        obj.should.have.property('link');
        obj.should.have.property('guid');
        obj.should.have.property('categories');
        obj.should.have.property('meta');
      });
    });
	  setTimeout( function(){done();}, 1000 );
	});

	after(function() {
	});

});


