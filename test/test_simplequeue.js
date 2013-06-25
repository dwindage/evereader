var should = require('should');
var simplequeue = require('simplequeue');

describe("test simplequeue", function() {

    var WORKER_INTERVAL = 30; // miiliseconds
    var TERMINATE_MESSAGE = '====>>TERMINATE_MESSAGE<<=====';
    var test_query = [];

	before(function() {
        test_query = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	});

	it("simple queue basic (sync) test", function(done) {
        var queue = simplequeue.createQueue();

        for(var i=0; i<test_query.length; i++)
        {
            queue.putMessage(test_query[i]);
        }

        for(var i=0; i<test_query.length; i++)
        {   
            var message = queue.getMessageSync();
            message.should.equal(test_query[i]);
        }
        var message = queue.getMessageSync();
        should.not.exist(message);

        done();
	});

    it("simple queue async test", function(done) {
        var queue = simplequeue.createQueue();

        // worker : consumer
        var beforeMsg = -1; // for checking long interval message
        var intervalId = setInterval( function() {
            
            queue.getMessage(function (err, msg) {
                should.not.exist(err);
                should.exist(msg);

                if(msg === TERMINATE_MESSAGE) { // terminate

                    // check long interval message
                    beforeMsg.should.equal(0);

                    clearInterval(intervalId);
                    done();
               } else { // working...
                   Math.floor((Math.random()*100)+1);
               }

                beforeMsg = msg 
            });
            
        }, WORKER_INTERVAL);

        // producer
        for(var i=0; i<100; i++)
        {
            var msg = Math.floor((Math.random()*100));
            queue.putMessage(msg);
        }
        // producer : long interval insetred message
        setTimeout( function(){
            queue.putMessage(0);
            queue.putMessage(TERMINATE_MESSAGE);
        }, 3000 );

	});

	after(function() {
	});
});


