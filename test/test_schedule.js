var should = require('should');
var schedule = require('node-schedule');

describe("node-schedule test", function() {
    before(function() {
    });

    it("test recurrence", function(done) {
        var recurrence_rule = new schedule.RecurrenceRule();
        recurrence_rule.second = new schedule.Range(0, 59, 2);
        var count = 0;

        var job = schedule.scheduleJob(recurrence_rule, function() {
            var time_string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log(time_string);
            count += 1;
        }); 

        setTimeout(function(){
            count.should.equal(3);
            done();
        }, 7000);
    });

    after(function() {
    });
});
