var	request = require('request'),
	feedparser = require('feedparser');

var printable = true;
var p = function(error_name, message) {
	console.error(error_name + ' : ' + message);
};

var check = function(url, done, validation, printable) {
	try {
		var req = request(url);
		req.on('error', function(error) {
			if(printable) p('error', error);

			validation.should.not.be.ok;
			done();
		});

		req.pipe(new feedparser())
			.on('error', function(error) {
				if(printable) p('error', error);

				validation.should.not.be.ok;
				done();
			})
			.on('meta', function(meta) {
				if(printable) p('meta', meta);

				validation.should.be.ok;
				done();
			})
			;
		req.end();
	} catch(e) {
		if(printable) p('exception', e);

		validation.should.not.be.ok;
		done();
	}

};

describe('How to use feedparser', function() {

	before(function() {
	});

	after(function() {
	});

	describe('feedparser error', function() {
		
		it('feedparser uri error', function(done) {
			error_url = '';
			check(error_url, done, false, printable);
		});
		it('feedparser uri error', function(done) {
			error_url = 'http://errorurl.com';
			check(error_url, done, false, printable);
		});
		it('feedparser uri error', function(done) {
			error_url = 'http://bwhyuk.tumblr.com';
			check(error_url, done, false, printable);
		});
		it('feedparser uri error', function(done) {
			error_url = 'www.erroruri.com';
			check(error_url, done, false, printable);
		});
		it('feedparser uri error', function(done) {
			error_url = 'httb://error.com';
			check(error_url, done, false, printable);
		});
		it('feedparser uri error', function(done) {
			error_url = 'http://com';
			check(error_url, done, false, printable);
		});
		it('feedparser uri error', function(done) {
			error_url = 'https://bwhyuk.tumblr.com';
			check(error_url, done, false, printable);
		});

		it('feedparser valid uri', function(done) {
			error_url = 'http://bwhyuk.tumblr.com/rss';
			check(error_url, done, true, printable);
		});
		it('feedparser not valid uri', function(done) {
			error_url = 'bwhyuk.tumblr.com/rss';
			check(error_url, done, false, printable);
		});


	});


});


