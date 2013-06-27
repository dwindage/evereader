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
        model.get_url_list(message, queue);

        setTimeout(function() {
            queue.length().should.equal(1);
            
            var message = queue.getMessageSync();
            message.should.be.an.instanceof(model.job_message);

            done();
        }, 1000);
    });

    it("test get feed data", function(done) {
        var message = new model.job_message();

        message.user_token = config.valid_token;
        message.url_list.push('http://bwhyuk.tumblr.com/rss');
        var queue = simplequeue.createQueue();

        model.get_rss_feed_data(message, queue);

        setTimeout(function() {
            queue.length().should.equal(1);

            var message = queue.getMessageSync();
            message.should.be.an.instanceof(model.job_message);

            done();
        }, 1000);
    });
	
	after(function() {
	});
});


