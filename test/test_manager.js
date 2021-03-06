var should = require('should');

global.config = require('../config');
global.db_config = require('../db_config.js');

var manager_lib = require('../lib/manager')
  , userDao = require('../lib/userDao.js');

function sum(oprd1, oprd2) {
    return oprd1 + oprd2;
}

describe("test manager_lib", function() {

	before(function() {
        userDao.initDB(db_config.dbPath,db_config.db, db_config.userTablename);
	});

	it("test manager_lib monitoring", function(done) {
        var scheduler = new manager_lib();

        scheduler.should.be.an.instanceof(manager_lib);
        scheduler.get_number_of_queues().reduce(sum).should.equal(0);
        scheduler.get_number_of_workers().reduce(sum).should.equal(0);

        done();
	});


    it("test update user token", function(done) {
        userDao.readAllUsers(function(err,rows){
            rows.length.should.above(0);
            done();
        });
    });

    it("test manager_lib operation", function(done) {
        var scheduler = new manager_lib();

        scheduler.get_number_of_workers().reduce(sum).should.equal(0);

        // add worker
        scheduler.add_worker().should.equal(true);
        scheduler.get_number_of_workers().reduce(sum).should.equal(4);
        scheduler.add_worker(0).should.equal(true);
        scheduler.get_number_of_workers()[0].should.equal(2)
        scheduler.get_number_of_workers().reduce(sum).should.equal(5);
        scheduler.add_worker(1).should.equal(true);
        scheduler.get_number_of_workers()[1].should.equal(2)
        scheduler.get_number_of_workers().reduce(sum).should.equal(6);
        scheduler.add_worker(2).should.equal(true);
        scheduler.get_number_of_workers()[2].should.equal(2)
        scheduler.get_number_of_workers().reduce(sum).should.equal(7);
        scheduler.add_worker(3).should.equal(true);
        scheduler.get_number_of_workers()[3].should.equal(2)
        scheduler.get_number_of_workers().reduce(sum).should.equal(8);

        scheduler.add_worker(4).should.equal(false);
        scheduler.get_number_of_workers().reduce(sum).should.equal(8);

        scheduler.add_worker().should.equal(true);
        scheduler.get_number_of_workers().reduce(sum).should.equal(12);

        // reduce worker
        scheduler.reduce_worker().should.equal(true);
        scheduler.get_number_of_workers().reduce(sum).should.equal(8);

        scheduler.reduce_worker(0).should.equal(true);
        scheduler.get_number_of_workers()[0].should.equal(1)
        scheduler.get_number_of_workers().reduce(sum).should.equal(7);

        scheduler.reduce_worker(1).should.equal(true);
        scheduler.get_number_of_workers()[1].should.equal(1)
        scheduler.get_number_of_workers().reduce(sum).should.equal(6);

        scheduler.reduce_worker(2).should.equal(true);
        scheduler.get_number_of_workers()[2].should.equal(1);
        scheduler.get_number_of_workers().reduce(sum).should.equal(5);

        scheduler.reduce_worker(3).should.equal(true);
        scheduler.get_number_of_workers()[3].should.equal(1);
        scheduler.get_number_of_workers().reduce(sum).should.equal(4);


        scheduler.reduce_worker(4).should.equal(false);
        scheduler.get_number_of_workers().reduce(sum).should.equal(4);
        

        // member function
        scheduler.reduce_worker();
        scheduler.get_number_of_workers().reduce(sum).should.equal(0);

        scheduler.insert_user_token(config.valid_token);

        setTimeout(function() {
            scheduler.get_number_of_queues().reduce(sum).should.equal(1);
            done();
        }, 300);

    });

    it("entire test", function(done) {
        var scheduler = new manager_lib();

        scheduler.add_worker();
        scheduler.get_number_of_workers().reduce(sum).should.equal(4);
        scheduler.get_number_of_queues().reduce(sum).should.equal(0);

        scheduler.insert_user_token(config.valid_token);
        scheduler.get_number_of_queues().reduce(sum).should.equal(1);
        
        console.log(scheduler.get_number_of_queues());
        var intervalId = setInterval(function() {
            console.log(scheduler.get_number_of_queues());
        }, 300);

        setTimeout(function() {
            done();
        }, 8000);
    });

	after(function() {
	});
});

