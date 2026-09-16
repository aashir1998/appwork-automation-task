#!/bin/sh
# Runs cy:run, then always merges/generates the report (even on test
# failure) while still exiting with the real test exit code so CI fails
# correctly.
set -e
npm run pretest

set +e
npm run cy:run -- "$@"
test_exit=$?
set -e

npm run report:merge
npm run report:generate

exit "$test_exit"
