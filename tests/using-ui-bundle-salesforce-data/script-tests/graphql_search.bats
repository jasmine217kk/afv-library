#!/usr/bin/env bats

SCRIPT="skills/using-ui-bundle-salesforce-data/scripts/graphql-search.sh"

@test "exits 1 with no arguments" {
  run bash "$SCRIPT"
  [ "$status" -eq 1 ]
}

@test "shows usage text when called with no arguments" {
  run bash "$SCRIPT"
  [[ "$output" == *"Usage:"* ]]
}

@test "exits 1 when schema file does not exist" {
  run bash "$SCRIPT" -s /nonexistent/schema.graphql Account
  [ "$status" -eq 1 ]
}

# TODO: Add more tests - valid schema lookup, entity extraction, multiple entities, etc.
