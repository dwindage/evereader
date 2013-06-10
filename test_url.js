/*!
 * node-feedparser
 * Copyright(c) 2013 Dan MacTough <danmactough@gmail.com>
 * MIT Licensed
 */

var FeedParser = require('feedparser')
  , request = require('request');

feed = 'http://feeds.feedburner.com/channy';

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
  });
