
REPORTER = spec
TIMEOUT = 10s

<<<<<<< HEAD
test: test-entire test-modules test-evernote-api test-feedparser-check-uri test-feedparser-validate-data test-sqlite
=======
test: test-entire test-modules test-evernote-api test-feedparser-check-uri test-feedparser-validate-data test-simplequeue
>>>>>>> 318503e857f0eaa4d7c5c6fc826015b89e17ee11

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

<<<<<<< HEAD
test-sqlite:
=======
test-simplequeue:
>>>>>>> 318503e857f0eaa4d7c5c6fc826015b89e17ee11
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
<<<<<<< HEAD
		test/test_sqlite.js
=======
		test/test_simplequeue.js
>>>>>>> 318503e857f0eaa4d7c5c6fc826015b89e17ee11


.PHONY: test test-w test-my

