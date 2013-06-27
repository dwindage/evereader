var should = require('should');
var simplequeue = require('simplequeue');

global.config = require('../config');
var model = require('../lib/workingModel');

describe("test working model", function() {

	before(function() {
	});

	it("test job_message", function() {
        var message = new model.job_message();

        message.should.be.an.instanceof(model.job_message);
	});

    it("test get url list", function(done) {
        var message = new model.job_message();

        message.user_token = config.valid_token;
        var queue = simplequeue.createQueue();
        model.get_rss_feed_url(message, queue);

        setTimeout(function() {
            queue.length().should.equal(1);
            
            var message = queue.getMessageSync();
            message.should.be.an.instanceof(model.job_message);

            done();
        }, 5000);
    });

    it("test get feed data", function(done) {
        var message = new model.job_message();

        message.user_token = config.valid_token;
        message.rss_url_list.push('http://bwhyuk.tumblr.com/rss');
        var queue = simplequeue.createQueue();

        model.get_rss_feed_data(message, queue);

        setTimeout(function() {
            queue.length().should.equal(3);

            while(message = queue.getMessageSync()) {
                message.should.be.an.instanceof(model.job_message);
                message.article_list.length.should.equal(1);
            }

            done();
        }, 3000);
    });
	
	after(function() {
	});
});


