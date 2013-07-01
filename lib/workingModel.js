var evereader = require('./evereader');

exports.job_message = job_message;
function job_message() {
    var self = this;

    this.user_token = '';
    this.rss_url_list = [];
    this.article_list = [];
    this.status_code = 0;

    this.error = null;

    this.clone = function() {
        var clone_obj = new job_message();

        clone_obj.user_token = self.user_token;
        for(var i=0; i<self.rss_url_list.length; i++)
            clone_obj.rss_url_list.push( self.rss_url_list[i] );
        for(var i=0; i<self.article_list.length; i++)
            clone_obj.article_list.push( self.article_list[i] );
        clone_obj.status_code = self.status_code;

        clone_obj.error = self.error;
        return clone_obj;
    }
}

exports.get_rss_feed_url = get_rss_feed_url;
function get_rss_feed_url(message, outputQueue) {
    if(message.error) return;

    evereader.get_url_list(message.user_token, function(err, url_list) {
        var out_message = message.clone();
        if(err) {
            out_message.error = err;
            return;
        }

        for(var i=0; i<url_list.length; i++) {
            out_message.rss_url_list.push( url_list[i] );
        }
        outputQueue.putMessage(out_message);
    });
}

exports.get_rss_feed_data = get_rss_feed_data;
function get_rss_feed_data(message, outputQueue) {
    if(message.error) return;

    message.rss_url_list.forEach(function(rss_url) {
        evereader.parse(rss_url, function(err, article_list) {
            var out_message = message.clone();
            if(err) {
                out_message.error = err;
                return;
            }

            for(var i=0; i<article_list.length; i++) {
                out_message.article_list.push( article_list[i] );
            }
            outputQueue.putMessage(out_message);
        });
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
            var out_message = message.clone();
            if(err) {
                out_message.error = err;
		out_message.status_code = status_code;
            } else {
                out_message.status_code = status_code;
            }
            outputQueue.putMessage(out_message);
        });
    });
}

exports.sink_hole = sink_hole;
function sink_hole(message, outputQueue) {
//    if(message.error) return;
    // do nothing for sink hole
	console.log(message.user_token, message.status_code, message.error); 
}

exports.sink_hole_verbose = sink_hole_verbose;
function sink_hole_verbose(message, outputQueue) {
    console.log(message);
}
