var should = require('should');
var user = {};

var Car = function() {
};
var car = new Car();

describe("How to use BDD by should.js", function() {
	before(function() {
		user = {
			name: 'tj',
			pets: ['tobi', 'loki', 'jane', 'bandit'],
			age : 15
		};
	});

	after(function() {
	});

	it("should exist test", function() {
		should.exist({});
		should.not.exist(null);
		should.not.exist(undefined);
	});

	it("should variable equal test", function() {
		(1).should.equal(1);
		(10).should.equal(10);

		(11).should.not.equal(10);
	});

	it("should argument test", function() {
		var args = (function(){ return arguments; })(1,2,3);
		args.should.be.arguments;
		[].should.not.be.arguments;
	});

	it("should within test", function() {
		(10).should.be.within(5, 15);

		(10).should.not.be.within(20, 30);
	});

	it("should a test", function() {
		user.should.be.a('object');
		user.pets.should.be.a('object');
		'test'.should.be.a('string');
	});

	it("should instance of test", function() {
		car.should.be.an.instanceof(Car);
		user.pets.should.be.an.instanceof(Array);
	});

	it("should match test", function() {
		user.name.should.match(/^\w+$/)
	});

	it("should property test", function() {
		user.should.have.property("name");
		user.should.have.property("age", 15);

		user.should.not.have.property("age", 15);
	});
});


