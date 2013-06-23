
REPORTER = spec

test: test-modules test-evernote-api test-feedparser-check-uri test-feedparser-validate-data

test-w:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--growl \
		--watch \
	        --timeout 10s \

test-modules:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout 10s \
		test/test_modules.js

test-evernote-api:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout 10s \
		test/test_evernote_api.js

test-feedparser-check-uri:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout 10s \
		test/test_feedparser_check_uri.js

test-feedparser-validate-data:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout 10s \
		test/test_feedparser-validate-data.js

.PHONY: test test-w test-my

