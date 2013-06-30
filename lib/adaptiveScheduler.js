var manager = require('./manager');
var schedule = require('node-schedule');

module.exports = adaptive_scheduler;
function adaptive_scheduler(logger) {
    self = this;
    this.logger = logger;

    this.min_process_count = 1;
    this.max_process_count = 10;

    this.adaptive_recurrence_rule = new schedule.RecurrenceRule();
    this.adaptive_recurrence_rule.minute = new schedule.Range(0, 59);;

    this.update_recurrence_rule = new schedule.RecurrenceRule();
    this.update_recurrence_rule.minute = new schedule.Range(0, 59);;
    console.log(self);
    console.log(self.evereader_mgr);

    this.evereader_mgr = new manager();
    this.evereader_mgr.add_worker(); // at least 1 workers
    console.log(self);
    console.log(self.evereader_mgr);

    this.adaptive_job = schedule.scheduleJob(this.adaptive_recurrence_rule, function() {
        console.log('adaptive_job');
        console.log(self);
        console.log(self.evereader_mgr);

        // adaptive scheduling

        // logging
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
            self.logger('[' + time_string + '] adaptive queues  size : ' + queue_sizes);
            self.logger('[' + time_string + '] adaptive workers size : ' + worker_sizes);
        }
    });

    this.update_job = schedule.scheduleJob(this.update_recurrence_rule, function() {
        console.log('update_job');

        var befor_count = self.evereader_mgr.get_number_of_queues()[0];
        self.evereader_mgr.update_user_token();
        var after_count = self.evereader_mgr.get_number_of_queues()[0];

        // for test
        self.evereader_mgr.insert_user_token( config.valid_token );
        self.evereader_mgr.insert_user_token( config.valid_token );
        self.evereader_mgr.insert_user_token( config.valid_token );

        if(self.logger) {
            var time_string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

            self.logger('[' + time_string + '] update user token count : ' + (after_count - befor_count));
        }
    });

}


