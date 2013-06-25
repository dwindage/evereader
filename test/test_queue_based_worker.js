var should = require('should');
var sleep = require('sleep');
var simplequeue = require('simplequeue');
var worker = require('../lib/worker');

describe("test queue based worker", function() {

    function bypass_function(message, queue) {
        queue.putMessage(message);
    }

    function timeout_1s_function(message, queue) {
        sleep.sleep(1);
        queue.putMessage(message);
    }

	before(function() {
	});

	it("test worker bypass", function(done) {
        var inputQueue = simplequeue.createQueue();
        var outputQueue = simplequeue.createQueue();

        var bypass_worker1 = new worker(inputQueue, outputQueue, bypass_function);
        var bypass_worker2 = new worker(inputQueue, outputQueue, bypass_function);
        var bypass_worker3 = new worker(inputQueue, outputQueue, bypass_function);

        bypass_worker1.process();
        bypass_worker2.process();
        bypass_worker3.process();

        for(var i=0; i<10; i++) {
            inputQueue.putMessage(i);
        }

        setTimeout(function(){
            bypass_worker1.terminate();
            bypass_worker2.terminate();
            bypass_worker3.terminate();

            outputQueue.messages.length.should.equal(10);
            done();
        }, 500);
	});
	
    it("test worker timeout (n=1)", function(done) {
        var n = 1;

        var inputQueue = simplequeue.createQueue();
        var outputQueue = simplequeue.createQueue();
        var worker_list = []

        for(var i=0; i<n; i++) {
            var timeout_worker = new worker(inputQueue, outputQueue, timeout_1s_function);
            timeout_worker.process();
//            worker_list.push(timeout_worker);
        }

        for(var i=0; i<10; i++) {
            inputQueue.putMessage(i);
        }

        setTimeout(function(){
            console.log(outputQueue.messages);
            outputQueue.messages.length.should.be.within(1, 2);
            done();
        }, 1500);
	});
	
    it("test worker timeout (n=10)", function(done) {
        var n = 10;

        var inputQueue = simplequeue.createQueue();
        var outputQueue = simplequeue.createQueue();

        for(var i=0; i<n; i++) {
            var timeout_worker = new worker(inputQueue, outputQueue, timeout_1s_function);
            timeout_worker.process();
        }

        for(var i=0; i<10; i++) {
            inputQueue.putMessage(i);
        }

        setTimeout(function(){
            console.log(outputQueue.messages);
            outputQueue.messages.length.should.be.within(9, 10);
            done();
        }, 1500);
	});

	after(function() {
	});
});


