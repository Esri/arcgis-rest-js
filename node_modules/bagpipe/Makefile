TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 2000
JSCOVERAGE = ./node_modules/.bin/jscover

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov:
	@$(MAKE) test REPORTER=dot
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov > coverage.html
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=travis-cov

test-all: test test-cov

clean:
	@rm -rf node_modules

.PHONY: test test-cov test-all clean
