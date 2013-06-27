var should = require('should');
var sleep = require('sleep');
var simplequeue = require('simplequeue');
var worker = require('../lib/worker');

describe("test queue based worker", function() {

    function bypass_function(message, queue) {
        queue.putMessage(message);
    }

    function sleep_10ms_function(message, queue) {
        sleep.usleep(10000);
        queue.putMessage(message);
    }

    function timeout_100ms_function(message, queue) {
        sleep.usleep(100000);
            queue.putMessage(message);
    }

    function timeout_300ms_function(message, queue) {
        setTimeout(function() {
            queue.putMessage(message);
        }, 300);
    }


	before(function() {
	});

	it("test worker bypass", function(done) {
        var inputQueue = simplequeue.createQueue();
        var outputQueue = simplequeue.createQueue();

        var bypass_worker1 = new worker("worker1", inputQueue, outputQueue, bypass_function);
        var bypass_worker2 = new worker("worker2", inputQueue, outputQueue, bypass_function);
        var bypass_worker3 = new worker("worker3", inputQueue, outputQueue, bypass_function);

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

            inputQueue.messages.length.should.equal(0);
            outputQueue.messages.length.should.equal(10);
            done();
        }, 1500);
	});
	
    it("test worker timeout (n=1)", function(done) {
        var n = 1;

        var inputQueue = simplequeue.createQueue();
        var outputQueue = simplequeue.createQueue();
        var worker_list = []

        for(var i=0; i<n; i++) {
            var timeout_worker = new worker("worker"+i, inputQueue, outputQueue, timeout_100ms_function);
            timeout_worker.process();
            worker_list.push(timeout_worker);
        }

        for(var i=0; i<10; i++) {
            inputQueue.putMessage(i);
        }

        setTimeout(function(){
            for(var i=0; i<n; i++) {
                worker_list[i].terminate();
            }

            outputQueue.messages.length.should.be.within(1, 3);
            done();
        }, 1000);
	});
	
    it("test worker timeout (n=10)", function(done) {
        var n = 10;

        var inputQueue = simplequeue.createQueue();
        var outputQueue = simplequeue.createQueue();
        var worker_list = [];

        for(var i=0; i<n; i++) {
            var timeout_worker = new worker("worker"+i, inputQueue, outputQueue, timeout_100ms_function);
            timeout_worker.process();
            worker_list.push(timeout_worker);
        }

        for(var i=0; i<10; i++) {
            inputQueue.putMessage(i);
        }

        setTimeout(function(){
            for(var i=0; i<n; i++) {
                worker_list[i].terminate();
            }

            outputQueue.messages.length.should.be.within(9, 10);
            done();
        }, 1000);
	});
    
    it("test worker pipeline (n=10)", function(done) {
        var n = 10;
        var item_count = 30;

        var queue1 = simplequeue.createQueue();
        var queue2 = simplequeue.createQueue();
        var queue3 = simplequeue.createQueue();
        var queue4 = simplequeue.createQueue();

        var worker_list = []

        for(var i=0; i<n; i++) {
            var timeout_worker = new worker("worker1-"+i, queue1, queue2, timeout_100ms_function);
            timeout_worker.process();
            worker_list.push(timeout_worker);
        }

        for(var i=0; i<n; i++) {
            var timeout_worker = new worker("worker2-"+i, queue2, queue3, timeout_300ms_function);
            timeout_worker.process();
            worker_list.push(timeout_worker);
        }

        for(var i=0; i<n; i++) {
            var timeout_worker = new worker("worker3-"+i, queue3, queue4, timeout_100ms_function);
            timeout_worker.process();
            worker_list.push(timeout_worker);
        }
        
        for(var i=0; i<item_count; i++) {
            queue1.putMessage(i);
        }

        console.log('size of message queue');
        var time_count = 0;
        var intervalId = setInterval(function(){
            time_count += 1;

            console.log(time_count,
                queue1.length(),
                queue2.length(),
                queue3.length(),
                queue4.length() );

            if(queue4.length() >= item_count) {
                for(var i=0; i<worker_list.length; i++) {
                    worker_list[i].terminate()
                }

                done();
                clearInterval(intervalId);
            }
        }, 100);
	});

	after(function() {
	});
});


