
REPORTER = dot

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \

test-w:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--growl \
		--watch 

.PHONY: test test-w

