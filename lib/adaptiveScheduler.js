var manager = require('./manager');
var schedule = require('node-schedule');

module.exports = adaptive_scheduler;
function adaptive_scheduler(logger) {
    var self = this;
    this.logger = logger;

    this.min_process_count = 1;
    this.max_process_count = 10;
    this.threshold_queue_size = 30;

    this.adaptive_recurrence_rule = new schedule.RecurrenceRule();
    this.adaptive_recurrence_rule.second = new schedule.Range(0, 59, 10);

    this.update_recurrence_rule = new schedule.RecurrenceRule();
    this.update_recurrence_rule.second = new schedule.Range(0, 59, 30);

    this.monitoring_recurrence_rule = new schedule.RecurrenceRule();
    this.monitoring_recurrence_rule.second = new schedule.Range(0, 59, 1);

    this.evereader_mgr = new manager();
    this.evereader_mgr.add_worker(); // at least 1 workers

    this.adaptive_job = schedule.scheduleJob(this.adaptive_recurrence_rule, function() {
        var before_workers = self.evereader_mgr.get_number_of_workers();

        //adaptive scheduling
        var number_of_queues = self.evereader_mgr.get_number_of_queues();
        for(var i=0; i<number_of_queues.length-1; i++) {
            // increase worker
            if(number_of_queues[i] > self.threshold_queue_size) {
                if(before_workers[i] < self.max_process_count) {
                    self.evereader_mgr.add_worker(i);
                }
            }

            // decrease worker
            if(number_of_queues[i] <= 0) {
                if(before_workers[i] > self.min_process_count) {
                    self.evereader_mgr.reduce_worker(i);
                }
            }
        }

        var after_workers = self.evereader_mgr.get_number_of_workers();

        // logging
        if(self.logger) {
            var time_string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

            var worker_sizes = '';
            for(var i=0; i<before_workers.length; i++)
                worker_sizes += (after_workers[i] - before_workers[i]) + ' ';
            self.logger('[' + time_string + '] [adaptive] workers size : ' + worker_sizes);
        }
    });

    this.update_job = schedule.scheduleJob(this.update_recurrence_rule, function() {
        var befor_count = self.evereader_mgr.get_number_of_queues()[0];
        self.evereader_mgr.update_user_token();
        var after_count = self.evereader_mgr.get_number_of_queues()[0];

        if(self.logger) {
            var time_string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

            self.logger('[' + time_string + '] [update] user token count : ' + (after_count - befor_count));
        }
    });

    this.monitoring_job = schedule.scheduleJob(this.monitoring_recurrence_rule, function() {
        var number_of_queues = self.evereader_mgr.get_number_of_queues();
        var number_of_workers = self.evereader_mgr.get_number_of_workers();
        if(self.logger) {
            var time_string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

            var queue_sizes = '';
            for(var i=0; i<number_of_queues.length; i++) 
                queue_sizes += number_of_queues[i] + ' ';
            var worker_sizes = '';
            for(var i=0; i<number_of_workers.length; i++)
                worker_sizes += number_of_workers[i] + ' ';
            self.logger('[' + time_string + '] [monitoring] queues  size : ' + queue_sizes);
            self.logger('[' + time_string + '] [monitoring] workers size : ' + worker_sizes);
        }
    });


}


