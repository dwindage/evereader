
global.db_config = require('../db_config.js');

var userDao = require('../lib/userDao.js');

var should = require('should');

function p(m, v){
	console.log(m, v);
}

describe("How to use Sqlite", function() {
	
	before(function(done){
		userDao.initDB(db_config.db, db_config.userTablename);
		done();
	});

	describe("insert User", function(){
		it("insert User to user_info table", function(done) {
			userDao.insertUser("test","test");

			var userid = 'evereader';
			userDao.readUser(userid ,function(err,rows){
				if(rows.length < 1) {
					userDao.insertUser(userid,"S=s1:U=6eaef:E=146d174fccd:C=13f79c3d0d0:P=185:A=kjs8469-7232:V=2:H=070c10e2e8dc7eaf8a2973b9a8269b7f");
					done();
				}else{
					done();
				}
			});
		});
	});

	describe("update User", function(){
		it("update authToken in user_info table", function(done) {
			userDao.updateUser("test","update test",function(err,rows){
				should.not.exist(err);
				rows.length.should.equal(0);
				done();
			});
		});
	});

	describe("Read User", function(done){
		it("select User from user_info table", function(done) {
			userDao.readUser("evereader",function(err,rows){
				rows.length.should.be.equal(1);
				done();
			});
		});

		it("select All User from user_info table", function(done) {
			userDao.readAllUsers(function(err,rows){
				rows.length.should.be.above(0);
				p('rows',rows);
				done();
			});
		});
	});


	describe("Delete User", function(done){
		it("delete User from user_info table", function(done) {
			userDao.deleteUser("test",function(err,rows){
				should.not.exist(err);
				rows.length.should.equal(0);
				done();
			});
		});
	});

	after(function(){
	});
});


