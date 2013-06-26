var WORKER_INTERVAL = 30; // miliseconds

// work_function(message, outputQueue);
function worker(worker_name, inputQueue, outputQueue, work_function) {
    var self = this;
    this.name = worker_name;
    this.processing = true;
    this.input = inputQueue;
    this.output = outputQueue;
    this.work = work_function;

    this.processAsync = function() {
        if(self.processing == false)
            return;

        this.input.getMessage( function(err, message) {
            if(err) console.log(err);
            self.work(message, self.output);
        });

        setTimeout(self.processAsync, WORKER_INTERVAL);
    }

    this.processSync = function() {
        if(self.processing == false)
            return;

        var message = self.input.getMessageSync();
        if(message != null) {
            self.work(message, self.output);
        } else {
        }

        setTimeout(self.processSync, WORKER_INTERVAL);
    }

    this.process = this.processSync;

    this.terminate = function() {
        self.processing = false;
    }
};

module.exports = worker;
