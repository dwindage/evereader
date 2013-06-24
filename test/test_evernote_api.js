
global.config = require('../config.js');

var config = global.config;

var should = require('should');

var Evernote = require('evernode').Evernote;
var evernote = new Evernote(
	config.evernoteConsumerKey,
	config.evernoteConsumerSecret,
	config.evernoteUsedSandbox
);

function p(e,v){
	console.log(e , v);
}

describe("How to use Evernote API", function() {
	var userInfo = null;
	before(function(done){
		evernote.getUser(config.authToken, function(err, edamUser){
			userInfo = edamUser;
			done();
		});
	});


	it("Check valid authToken", function(done) {
		evernote.getUser(config.authToken, function(err, edamUser){
			should.exist(edamUser);
			edamUser.should.have.property("username");
			should.not.exist(err);
			done();
		});
	});

	it("Check invalid authToken", function(done) {
		evernote.getUser("invalid_authToken", function(err, edamUser){
			should.not.exist(edamUser);
			should.exist(err);
			err.should.have.property("errorCode",2);
			done();
		});
	});

	it("Get user infomation", function(done) {
		evernote.getUser(config.authToken, function(err, edamUser){
			edamUser.should.have.property("username","evereader");
			done();
		});
	});

	it("check exist notebook", function(done) {
		evernote.listNotebooks(userInfo, function(err, taglist) {
			taglist.forEach(function(tag){
				tag.should.have.property("guid");
				tag.should.have.property("name");
			});
			done();
	    });
	});

	it("make notebook", function(done) {
		evernote.listNotebooks(userInfo, function(err, taglist) {
			var not_exist_notebook = true;
			taglist.forEach(function(tag){
				if(tag.name=='test'){
					not_exist_notebook = false;
				}
			});
			if(not_exist_notebook){
				evernote.createNotebook(userInfo, {name:'test'}, function(err, tag) {
					should.exist(tag);
					tag.should.have.property('name','test');
					tag.should.have.property('guid');
					done();
		  		});
			} else {
				done();
			}

	    });
		
	});


	it("get tag list", function(done) {
		evernote.listTags(userInfo, function(err, tagList) {
  			tagList.forEach(function(tag){
  				tag.should.have.property("name");
  				tag.should.have.property("guid");
  			});
  			done();
  		});
	});

	it("get url note", function(done) {
		evernote.listTags(userInfo, function(err, tagList) {
			var guid_list = [];
			tagList.forEach(function(tag){
  				if(tag.name=='evereader-url'){
  					guid_list.push(tag.guid);
  				}
  			});

  			evernote.findNotes(userInfo,  'evereader-url', { tagGuids : guid_list }, function(err, noteList) {
    			noteList.notes.forEach(function(note){
	  				note.should.have.property("guid");
	  				evernote.getNote(userInfo, note.guid, function(err, note) {
	  					note.should.have.property('title','evereader-url');
              note.should.have.property('content'); 
					});
	  			});
	  			setTimeout(function(){done();},1000);
  			});
  		});
	});

	it("find tag", function(done) {
		evernote.listTags(userInfo, function(err, tagList) {
	   		var guid_list = [];
			tagList.forEach(function(tag){
  				if(tag.name=='guid'){
  					guid_list.push(tag.guid);
  				}
  			});
  			guid_list.length.should.equal(1);
  			done();
 		});
	});

	it("create tag", function(done) {
		evernote.createTag(userInfo, {'name':'tag'}, function(err, tag) {
			should.not.exist(tag);
			err.should.have.property("errorCode");
			done();
  		});
	});

	it("create note", function(done) {
		evernote.createNote(userInfo, { title: 'dwindage',
  content: '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">\n<en-note style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;"><div>백운혁</div>\n</en-note>' },function(err, note){
				
				//note.should.have.property('notebookGuid','43bb46e6-e7a6-4074-822c-a72c1b7255bf');
				note.should.have.property('title','dwindage');
				done();
		});
	});

	after(function(){
	});


});


