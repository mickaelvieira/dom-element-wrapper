OS         := $(shell uname -s)
PATH       := node_modules/.bin:bin:$(PATH)
SHELL      := /bin/bash
NODE_DIR   := node_modules
SOURCE_DIR := src
TARGET_DIR := dist

ESLINT     := @eslint --quiet -c .eslintrc
PRETTIER   := @prettier --write
ROLLUP     := @rollup -c rollup.config.js
JEST       := @NODE_ENV=test jest --config=jest.json

.PHONY: all clean install build watch lint fmt test test-watch test-coverage test-coveralls branch release

all: clean install

clean:
	@rm -rf ./dist

install:
	@yarn

build:
	$(ROLLUP)

watch:
	$(ROLLUP) --watch

lint:
	$(ESLINT) $(SOURCE_DIR)

fmt:
	$(PRETTIER) ./src/*.js
	$(PRETTIER) ./spec/*.js
	$(PRETTIER) rollup.config.js

test:
	$(JEST)

test-watch:
	$(JEST) --watch

test-coverage:
	$(JEST) --coverage

test-coveralls:
	@cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

branch:
	@create-branch

release:
	@create-release
