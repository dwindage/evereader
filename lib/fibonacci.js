module.exports = {};

calculate = function(number_of_terms) {
	if (number_of_terms <= 1) {
		return 0;
	} else if (number_of_terms == 2) {
		return 1;
	} else {
		return calculate(number_of_terms-2) + calculate(number_of_terms-1);
	}
	return 0;
};

module.exports.calculate = calculate;
