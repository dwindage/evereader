var	request = require('request'),
	feedparser = require('feedparser');

var printable = true;
var p = function(error_name, message) {
	console.error(error_name + ' : ' + message);
};

var check = function(url, done, validation, printable) {
	};

describe('How to use feedparser', function() {

	before(function() {
	});

	after(function() {
	});

	describe('feedparser valid data', function() {
		

		it('validate meta', function(done) {
			var validation = true;
			var printable = false;
			var url = 'http://bwhyuk.tumblr.com/rss';

			try {
				var req = request(url);
				req.on('error', function(error) {
					if(printable) p('error', error);

					vidation.should.not.be.ok;
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
						meta.should.have.property('title', 'Untitled');
						meta.should.have.property('link', 'http://bwhyuk.tumblr.com/');

						done();
					})
					;
			} catch(e) {
				if(printable) p('exception', e);

				validation.should.not.be.ok;
				done();
			}

		});

		it('validate article', function(done) {
			var validation = true;
			var printable = false;
			var url = 'http://bwhyuk.tumblr.com/rss';

			try {
				var req = request(url);
				req.on('error', function(error) {
					if(printable) p('error', error);

					vidation.should.not.be.ok;
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
					})
					.on('readable', function() {
						var stream = this, item;
						while( item = stream.read() ) {
							item.should.have.property('title');
							item.should.have.property('description');
							item.should.have.property('link');
							item.should.have.property('guid');
							item.should.have.property('pubDate');
							item.should.have.property('categories');
						}
						validation.should.be.ok;
					})
					;
				setTimeout( function(){done();}, 1000 );
			} catch(e) {
				if(printable) p('exception', e);

				validation.should.not.be.ok;
				done();
			}

		});


	});


});


