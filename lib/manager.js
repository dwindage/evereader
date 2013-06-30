var simplequeue = require('simplequeue');
var worker = require('./worker');
var model = require('./workingModel');

model_names = [
    'get_rss_feed_url',
    'get_rss_feed_data',
    'insert_rss_note',
    'sink_hole'
    ];
model_list = [
    model.get_rss_feed_url,
    model.get_rss_feed_data,
    model.insert_rss_note,
    model.sink_hole
    ];

function manager() {
    var self = this;
    this.input_queue = simplequeue.createQueue();
    this.feed_url_queue = simplequeue.createQueue();
    this.feed_data_queue = simplequeue.createQueue();
    this.insted_queue = simplequeue.createQueue();

    this.queues = [this.input_queue, this.feed_url_queue, this.feed_data_queue, this.insted_queue, null];
    this.workers = [[], [], [], []];

    // for monitoring
    this.get_number_of_queues = function() {
        var numbers = [];
        for(var i=0; i<self.queues.length; i++) {
            if(self.queues[i])
                numbers.push( self.queues[i].length() );
        }
        return numbers;
    };
    
    this.get_number_of_workers = function() {
        var numbers = [];
        for(var i=0; i<self.workers.length; i++) {
            numbers.push( self.workers[i].length );
        }
        return numbers;
    };

    // private member function
    this.insert_user_token = function(user_token) {
        var message = new model.job_message();
        message.user_token = user_token;

        self.input_queue.putMessage(message);
    };

    // for operation
    this.update_user_token = function() {
        // get user_token from DB
        // call insert_user_token
    };

    this.add_worker = function(index) {
        if(index != null) {
            if(index >= self.workers.length){
                return false;
            } else {
                var new_worker = new worker(
                        model_names[index],
                        self.queues[index],
                        self.queues[index+1],
                        model_list[index]);
                self.workers[index].push(new_worker);
                new_worker.process();
                return true;
            }
        } else { // entire
            for(var i=0; i<self.workers.length; i++){
                self.add_worker(i);
            }
            return true;
        }
    };

    this.reduce_worker = function(index) {
        if(index != null) {
            if(index >= self.workers.length) {
                return false;
            } else {
                var old_worker = self.workers[index].shift();
                old_worker.terminate();
                delete old_worker;
                return true;
            }
        } else {
            for(var i=0; i<self.workers.length; i++) {
                self.reduce_worker(i);
            }
            return true;
        }
    };
};

module.exports = manager;

