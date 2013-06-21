var expect = require('chai').expect;
var fibonacci = require('../lib/fibonacci');

describe("Fibonacci Test", function() {

	// setup
	before(function() {
	});

	it("should exist", function() {
//		var function_handler = fibonacci.calculate();
//		expect(function_handler).to.be.ok;
	});

	it("calculate()", function() {
		expect(fibonacci.calculate(1)).to.equal(0);
		expect(fibonacci.calculate(2)).to.equal(1);
		expect(fibonacci.calculate(3)).to.equal(1);

		expect(fibonacci.calculate(10)).to.equal(34);

		expect(fibonacci.calculate(29)).to.equal(317811);
	});


	it("calculate() invalide input", function() {
		expect(fibonacci.calculate(-1)).to.equal(0);
		expect(fibonacci.calculate(-2)).to.equal(0);
		expect(fibonacci.calculate(-10)).to.equal(0);
	});

	// teardown
	afterEach(function() {
	});

});

