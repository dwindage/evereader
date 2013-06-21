/*!
 * node-feedparser
 * Copyright(c) 2013 Dan MacTough <danmactough@gmail.com>
 * MIT Licensed
 */

var FeedParser = require('feedparser')
  , request = require('request');

feed = {
	uri:'http://feeds.feedburner.com/channy',
	headers: {
		'If-Modified-Since': 'Thu, 16 Mar 2013 23:59:59 GMT'
	}
};

request(feed)
  .pipe(new FeedParser())
  .on('error', function (error) {
    console.error(error);
  })
  .on('meta', function (meta) {
    console.log('===== %s =====', meta.title);
  })
  .on('article', function(article){
    console.log('Got article: %s', article.title || article.description);
	console.log('date : %s', article.date);
	console.log('author : %s', article.author);
	console.log('link : %s', article.link);
	console.log('');
  });
