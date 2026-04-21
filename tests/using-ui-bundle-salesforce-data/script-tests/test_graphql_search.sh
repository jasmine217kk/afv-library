#!/usr/bin/env bash
set -euo pipefail

PASS=0; FAIL=0
SCRIPT="skills/using-ui-bundle-salesforce-data/scripts/graphql-search.sh"

assert_eq() {
  local label="$1" expected="$2" actual="$3"
  if [[ "$expected" == "$actual" ]]; then
    echo "  ✓ $label"; PASS=$((PASS + 1))
  else
    echo "  ✗ $label (expected '$expected', got '$actual')"; FAIL=$((FAIL + 1))
  fi
}

assert_contains() {
  local label="$1" haystack="$2" needle="$3"
  if [[ "$haystack" == *"$needle"* ]]; then
    echo "  ✓ $label"; PASS=$((PASS + 1))
  else
    echo "  ✗ $label (expected to contain '$needle')"; FAIL=$((FAIL + 1))
  fi
}

echo "--- no arguments: prints usage and exits 1 ---"
rc=0; bash "$SCRIPT" >/dev/null 2>&1 || rc=$?
assert_eq "exits 1 with no args" "1" "$rc"

echo "--- missing schema file: exits 1 ---"
rc=0; bash "$SCRIPT" -s /nonexistent/schema.graphql Account >/dev/null 2>&1 || rc=$?
assert_eq "exits 1 on missing schema" "1" "$rc"

echo "--- no args shows usage text ---"
output=$(bash "$SCRIPT" 2>&1 || true)
assert_contains "shows usage" "$output" "Usage:"

# TODO: Add more tests - valid schema lookup, multiple entities, unknown entity warning, etc.

echo ""
echo "$PASS passed, $FAIL failed"
[[ $FAIL -eq 0 ]]
