var enml = require('enml-js');
var Evernote = require('evernode').Evernote;
var evernote = new Evernote(
	config.evernoteConsumerKey,
	config.evernoteConsumerSecret,
	config.evernoteUsedSandbox
);
var request = require('request');
var feedparser = require('feedparser');


var userInfo = null;
function detectErr(err, callback) {
  if (err) {
    callback(err, []);
    return true; 
  } else {
    return false;
  }
}

exports.get_url_list = function(token, callback) {

  evernote.getUser(token, function(err, edamUser){
    if (detectErr(err, callback)) return;
		evernote.listTags(edamUser, function(err, tagList) {
      if (detectErr(err, callback)) return;
			var guid_list = [];
			tagList.forEach(function(tag){
        if(tag.name=='evereader-url'){
          guid_list.push(tag.guid);
        }
      });

  	  evernote.findNotes(edamUser,  'evereader-url', { tagGuid : guid_list }, function(err, noteList) {
        if (detectErr(err, callback)) return;
        if (noteList.notes.length === 0) {
          callback({
            name: 'readerNoteListException',
            errorCode: 1002,
            parameter: 'words tag.guid'}, []);
        }
      	noteList.notes.forEach(function(note){
          evernote.getNote(edamUser, note.guid, function(err, n) {
            if (detectErr(err, callback)) return;

            var url_str = enml.PlainTextOfENML(n.content).trim()
            if (url_str === '') {
              callback({
                name: 'readerUrlListException',
                errorCode: 1001,
                parameter: 'note.guid'}, []); 
            } else {
              callback(
                undefined, 
                url_str.split(/\s/g).map(function(url) {
                  return url.indexOf('http') === -1 ? 'http://' + url : url;
                })
              );
            }
          });
        });

      });
    });
  });
};

exports.parse = function(url, callback) {
  try {
    var req = request(url);
    req.on('error', function(err) {
      callback({
        name: 'readerRequestException',
        errorCode: 1021,
        parameter: 'url'}, []);
    });

    req
      .pipe(new feedparser())
      .on('error', function(err) {
        callback({
          name: 'readerFeedparserException',
          errorCode: 1022,
          parameter: 'request stream'}, []);
      }).on('readable', function() {
        var stream = this, item, item_list = [];
        while (item = stream.read()) {
          item_list.push(item);   
        }
        callback(undefined, item_list);   
      });
  } catch (e) {
    callback({
      name: 'readerParserException',
      errorCode: 1023,
      parameter: 'try-catch'}, []);
  }
};
