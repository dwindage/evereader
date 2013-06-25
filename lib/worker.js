
exports.WORKER_INTERVAL = 30; // miliseconds

// work_function(message, outputQueue);
function worker(inputQueue, outputQueue, work_function) {
    self = this;
    this.processing = true;
    this.input = inputQueue;
    this.output = outputQueue;
    this.work = work_function;
};

worker.prototype.processAsync = function() {
    if(self.processing == false)
        return;

    self.input.getMessage( function(err, message) {
        if(err) console.log(err);

        self.work(message, self.output);
    });

    setTimeout(self.process, exports.WORKER_INTERVAL);
}

worker.prototype.processSync = function() {
    if(self.processing == false)
        return;

    var message = self.input.getMessageSync();
    if(message != null) {
        self.work(message, self.output);
    }

    setTimeout(self.process, exports.WORKER_INTERVAL);
}

worker.prototype.process = worker.prototype.processSync;

worker.prototype.terminate = function() {
    self.processing = false;
}

module.exports = worker;
