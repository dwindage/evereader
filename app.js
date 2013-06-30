global.config = require('./config');
var adaptive_scheduler = require('./lib/adaptiveScheduler');

function logger(message) {
    console.log(message)
}

var scheduler = new adaptive_scheduler(logger);

