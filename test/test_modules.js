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

describe("test evereader", function() {
	before(function() {
	});

	it("get url list: ", function(done) {
    evereader.get_url_list(users.valid_token, function(err, url_list) {
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
    evereader.get_url_list(users.empty_note_token, function(err, url_list) {
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
    evereader.get_url_list(users.empty_notebook_token, function(err, url_list) {
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
    evereader.get_url_list(users.empty_notebook_token, function(err, url_list) {
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
    evereader.parse('http://bwhyuk.tumblr.com/rss', function(err, arr) {
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
  
  it("insert note: valid_data", function(done) {
    var test_feed_data = {
      title: 'test1',
      description: '<p>test1 <img src="http://media.tumblr.com/ce46533ea563c3a953c67d4b8e3a4255/tumblr_inline_moth1237xa1qz4rgp.jpg"/>  description</p>',
      link: 'http://bwhyuk.tumblr.com/post/53578598355',
      guid: 'http://bwhyuk.tumblr.com/post/53578598355',
      author: null,
      categories: [ 'tag1' ],
      meta: {
        title: 'Untitled',
        link: 'http://bwhyuk.tumblr.com/'
      }
    };

    evereader.insert(users.valid_token, test_feed_data, function(err, status) {
      should.exist(status);
      should.not.exist(err);
      status.should.be.within(0, 1000);
      done();
    });
  });


	after(function() {
	});

});


