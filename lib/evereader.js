var enml = require('enml-js');
var Evernote = require('evernode').Evernote;
var evernote = new Evernote(
  config.evernoteConsumerKey,
  config.evernoteConsumerSecret,
  config.evernoteUsedSandbox
);
var request = require('request');
var feedparser = require('feedparser');

var converterENML = require('./convertENML');

var EVEREADER = 'evereader';
var URL_TAG_NAME = EVEREADER + '-url';
var NOTEBOOK_NAME = EVEREADER;

var userInfo = null;
function detectErr(err, callback) {
  if (err) {
    callback(err, []);
    return true; 
  } else {
    return false;
  }
}

// ModuleA
exports.get_url_list = function(token, callback) {
  'use strict';

  evernote.getUser(token, function(err, edamUser){
    if (detectErr(err, callback)) return;
      evernote.listTags(edamUser, function(err, tagList) {
      if (detectErr(err, callback)) return;
        var guid_list = [];
        tagList.forEach(function(tag){
        if(tag.name==URL_TAG_NAME){
          guid_list.push(tag.guid);
        }
      });

      // if tagname not has a evereader url note
      if(guid_list.length == 0) {
        callback({
          name: 'readerTagListException',
		  errorCode: 1003,
          parameter: 'tag.name'}, []);
	    return;
	  }

      evernote.findNotes(edamUser,  URL_TAG_NAME, { tagGuids : guid_list }, function(err, noteList) {
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

// ModuleC
exports.parse = function(url, callback) {
  'use strict';
  try {
    var req = request(url);
    req.on('error', function(err) {
      callback({
        name: 'readerRequestException',
        errorCode: 1021,
        parameter: 'url',
        requestError: err}, []);
    });

    req
      .pipe(new feedparser())
      .on('error', function(err) {
        callback({
          name: 'readerFeedparserException',
          errorCode: 1022,
          parameter: 'request stream',
          feedparserError: err}, []);
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
      parameter: 'try-catch',
      exceptionError: e}, []);
  }
};

// ModuleD
exports.insert = function(token, feed_data, callback) {
  'use strict';
  if (isValidFeedData(feed_data)) {
    evernote.getUser(token, function(err, edamUser){
      if (detectErr(err, callback)) return;
      evernote.listTags(edamUser, function(err, tagList) {
        if (detectErr(err, callback)) return;
        var guid_list = [];
        tagList.forEach(function(tag){
          if (tag.name == feed_data.guid){
            guid_list.push(tag.guid);
          }
        });

        evernote.listNotebooks(edamUser, function(err, notebookList) {
          var evereader_notebookGuid = '';
          notebookList.forEach(function(notebook) {
            if( notebook.name == NOTEBOOK_NAME) evereader_notebookGuid = notebook.guid;
          });

          if( !!err || evereader_notebookGuid == '' ) {
            callback(undefined, 401);
            return;
          }

          evernote.findNotes(edamUser,  '', { tagGuids : guid_list }, function(err, noteList) {
            if (detectErr(err, callback)) return;
          
			// guid_list 길이가 0이면 기존의 note갯수를 무시한다.
            if (guid_list.length > 0 && noteList.notes.length > 0) {
              callback({name:'alreadyInsertedNote'}, 304); 
            } else {
              //var content = enml.ENMLOfPlainText("Hello  World!!"); //feed_data['description'];
              
              decorator(feed_data['title'], feed_data['author'], feed_data['link'], feed_data['description'], function(err, content){
                var tagnames = feed_data['categories'];
                tagnames.push(feed_data['guid']);
                tagnames.push(feed_data['meta']['link']);
                //tagnames.push(feed_data['meta']['title'] || '');
                for(var t=0; t<tagnames.length; t++) {
                    tagnames[t] = tagnames[t].replace(/(\p{Cc}|\p{Z}|\p{Zl}|\p{Zp}|,)/g, '_');
                }

                evernote.createNote(edamUser, {
                  // evernote API limit title length : http://dev.evernote.com/documentation/reference/Limits.html#Const_EDAM_NOTE_TITLE_LEN_MAX
                  title: feed_data['title'].replace(/(\r\n|\n|\r)/,'').replace('&', '&amp;').substr(0, 200),
                  content: content,
                  notebookGuid: evereader_notebookGuid,
                  tagNames: tagnames
                  }, function(err, note) {
                    if (err) {
                      callback({
                        name: 'readerCreateNoteException',
                        errorCode: 1032,
                        parameter: 'note structure',
                        evernoteError: err}, 304);
                    } else {
                      callback(undefined, 200); 
                    }
                  }
                );
              });
            }
          });

        });

      });
    });
  } else {
    callback({
      name: '',
      errorCode: '',
      parameter: ''}, 1); 
  }

};

function isValidFeedData(data) {
  return !!data['title'] && !!data['link'] && !!data['guid'] && !!data['meta']['link'];
};

function decorator(title, author, link, description, callback) {

    converterENML.convert(description, function(err, converted_description) {
        var str = '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
        str += '<en-note style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;">'
        str += '<div><span style="font-size:large;"><strong>' + title + '</strong></span>';
        str += !!author ? ' <span style="font-size:small;">: ' + author + '</span>' : '';
        str += '</div><div><br clear="none"/></div>'
        str += !!link ? '<div><a shape="rect" href="' + link + '">' + link + '</a></div>' : '';
        str += '<div><br clear="none"/></div>';
        str += '<div>' + converted_description + '</div>'
        str += '<div><br clear="none"/></div>';
        str += get_logo();
        str += '</en-note>';

        callback(err, str);
    });
}

function get_logo() {
    var str = '<div>';
    str += '<div style="background-color: #6bb130; background-image: url(http://24.media.tumblr.com/ec64d0fe2381e97deb8e84f200741e3f/tumb lr_m p959c1gJm1sqjjz7o1_1280.png) no-repeat center top; border-bottom: 1px solid #5f9e2b; padding: 20px; text-align:center; font-family: Times New Roman; font-size:20px; font-weight: bold;">';
    str += '<a style="text-decoration:none; color:#fff;" href="http://for.evereader.io">';
//    str += '<img src="http://24.media.tumblr.com/avatar_c7a2827b46f4_128.png" width="24px" height="24px"></img>';
    str += ' FOR.EVEREADER.IO';
    str += '</a></div>';
    str += '</div>';
    return str;
}
