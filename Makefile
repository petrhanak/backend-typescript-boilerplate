SHELL := bash
export PATH := node_modules/.bin/:$(PATH)

log = @echo "[make] $(1)"

# Note about `touch`:
# npm does not update the timestamp of the node_modules folder itself. This confuses Make as it
# thinks node_modules is not up to date and tries to constantly install pacakges. Touching
# node_modules after installation fixes that.
node_modules: package-lock.json
	$(call log, "Installing dependencies")
	npm install
	touch node_modules

build: src node_modules tsconfig.json
	$(call log, "Compiling")
	rm -rf build
	babel src --out-dir build --extensions '.js,.ts'

compile: build

run: compile
	$(call log, "Running server")
	node build/index.js

watch:
	$(call log, "Watching files")
	nodemon --exec "babel-node --extensions '.js,.ts' src/index.ts"

test:
	$(call log, "Running tests")
	jest --forceExit

test-coverage:
	$(call log, "Running tests with coverage")
	jest --forceExit --coverage

cleanup:
	$(call log, "Formatting files")
	prettier "{src,test}/**/*.ts" --write --loglevel warn
	$(call log, "Linting files")
	tslint "{src,test}/**/*.ts" --force --fix
	$(call log, "Typechecking files")
	tsc

db-create-migration:
	knex migrate:make ${name}

db-migrate:
	$(call log, "Database migration")
	knex migrate:latest

db-rollback:
	$(call log, "Database rollback")
	knex migrate:rollback

db-reset: db-rollback db-migrate

db-create-seed:
	knex seed:make ${name}

db-seed:
	$(call log, "Database seed")
	knex seed:run


rules := \
	install \
	clean \
	compile \
	run \
	watch \
	test \
	test-coverage \
	cleanup \
	db-create-migration \
	db-migrate \
	db-create-seed \
	db-seed \
	db-reset \

.PHONY: $(rules)
.SILENT: $(rules) node_modules build
