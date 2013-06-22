var should = require('should'),
	feedparser = require('FeedParser'),
	request = require('request');

p = function(error_name, message) {
	console.error(error_name + ' : ' + message);
};

describe('How to use feedparser', function() {
	before(function() {
	});

	after(function() {
	});

	describe('feedparser error', function() {
		before(function() {
		});

		it('feedparser uri error', function() {
			var error_url_list = [];
			error_url_list.push('');
			error_url_list.push('http://errorurl.com');
			error_url_list.push('http://bwhyuk.tumblr.com');
			error_url_list.push('https://bwhyuk.tumblr.com');
			error_url_list.push('www.erroruri.com');

			error_url_list.push('httb://error.com');
			error_url_list.push('http://com');
			
			for(var i=0; i<error_url_list.length; i++) {
				error_url = error_url_list[i];

				error_status  = false;
				exception_status = false;
				meta_exist = false;

				try {
					request(error_url)
						.pipe(new feedparser())
						.on('error', function(error) {
							error_status = true;
						})
						.on('meta', function(meta) {
							meta_exist = true;
						})
						.on('readable', function() {
						})
						;
				} catch(e) {
					exception_status = true;
				}

				(error_status || exception_status || !meta_exist).should.be.true;
				meta_exist.should.be.false;
			}

		});

		it('feedparser examlep', function() {
			console.log('adjfkljalsdflslfjs');
			request('http://bwhyuk.tumblr.com/rss')
				.pipe(new feedparser())
				.on('error', function(error) {
					console.log(error);
				})
				.on('meta', function(meta) {
					console.log(meta);
				})
				.on('complete', function(data) {
					console.log(data);
				})
				;
		});
		it('feedparser valid uri', function() {
			var valid_url_list = [];
			valid_url_list.push('http://bwhyuk.tumblr.com/rss');
			valid_url_list.push('bwhyuk.tumblr.com/rss');
			
			for(var i=0; i<valid_url_list.length; i++) {
				valid_url = valid_url_list[i];

				error_status  = false;
				exception_status = false;
				meta_exist = false;

//				try {
					var a = request(valid_url)
						.pipe(new feedparser())
						.on('error', function(error) {
							error_status = true;
						})
						.on('meta', function(meta) {
							meta_exist = true;
							p('meta', meta);
						});
						console.log(a);
//				} catch(e) {
//					exception_status = true;
//				}

				(error_status && exception_status && !meta_exist).should.be.false;
				if(meta_exist == false) {
					p('meta exist false', valid_url);
				}
				meta_exist.should.be.true;
			}

		});


	});


});


