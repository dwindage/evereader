var evereader = require('../lib/evereader');

exports.job_message = job_message;
function job_message() {
    var self = this;

    this.user_token = '';
    this.rss_url_list = [];
    this.article_list = [];
    this.status_code = 0;

    this.error = null;
}

exports.get_rss_feed_url = get_rss_feed_url;
function get_rss_feed_url(message, outputQueue) {
    if(message.error) return;

    evereader.get_url_list(message.user_token, function(err, url_list) {
        if(err) {
            message.error = err;
            return;
        }

        for(var i=0; i<url_list.length; i++) {
            message.rss_url_list.push( url_list[i] );
        }
        outputQueue.putMessage(message);
    });
}

exports.get_rss_feed_data = get_rss_feed_data;
function get_rss_feed_data(message, outputQueue) {
    if(message.error) return;

    evereader.parse(message.rss_url_list, function(err, article_list) {
        if(err) {
            message.error = err;
            return;
        }

        for(var i=0; i<article_list.length; i++) {
            message.article_list.push( article_list[i] );
        }
        outputQueue.putMessage(message);
    });
}

exports.insert_rss_note = insert_rss_note;
function insert_rss_note(message, outputQueue) {
    if(message.error) return;
    if(message.article_list == null) {
        message.error = 'not exist articles';
        return;
    }

    message.article_list.forEach( function(article) {
        evereader.insert(message.user_token, article, function(err, status_code) {
            var out_message = message;
            if(err) {
                out_message.error = err;
            } else {
                out_message.status_code = status_code;
            }
            outputQueue.putMessage(out_message);
        });
    });
}

