
REPORTER = spec
TIMEOUT = 10s

test: test-entire test-modules test-evernote-api test-feedparser-check-uri test-feedparser-validate-data test-simplequeue test-sqlite

test-w:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--growl \
		--watch \
		--timeout $(TIMEOUT) 

test-entire:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		test/test_entire.js

test-modules:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		test/test_modules.js

test-evernote-api:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		test/test_evernote_api.js

test-feedparser-check-uri:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		test/test_feedparser_check_uri.js

test-feedparser-validate-data:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		test/test_feedparser-validate-data.js

test-sqlite:	
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		test/test_sqlite.js

test-simplequeue:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		test/test_simplequeue.js


.PHONY: test test-w test-my

