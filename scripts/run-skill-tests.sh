#!/usr/bin/env bash
#
# Discovery script for co-located script-tests.
# Walks tests/*/script-tests/, matches files by extension, runs the right tool.
#
# Usage:
#   ./scripts/run-skill-tests.sh

set -euo pipefail

TESTS_DIR="tests"
EXIT_CODE=0
RAN=0

for script_test_dir in "$TESTS_DIR"/*/script-tests; do
  [ -d "$script_test_dir" ] || continue
  skill=$(basename "$(dirname "$script_test_dir")")

  # Python tests (requires pytest installed)
  py_files=$(find "$script_test_dir" -not -path '*/.*/*' \( -name 'test_*.py' -o -name '*_test.py' \) 2>/dev/null || true)
  if [[ -n "$py_files" ]]; then
    if python3 -m pytest --version &>/dev/null; then
      echo "=== $skill: pytest ==="
      python3 -m pytest "$script_test_dir" -v --tb=short || EXIT_CODE=1
      RAN=$((RAN + 1))
      echo
    else
      echo "=== $skill: SKIPPED (pytest not installed — run 'pip3 install pytest') ==="
      echo
    fi
  fi

  # Bash tests (.sh) — no external tools needed
  sh_files=$(find "$script_test_dir" -not -path '*/.*/*' \( -name 'test_*.sh' -o -name '*_test.sh' \) 2>/dev/null || true)
  if [[ -n "$sh_files" ]]; then
    echo "=== $skill: bash ==="
    while IFS= read -r f; do
      bash "$f" || EXIT_CODE=1
    done <<< "$sh_files"
    RAN=$((RAN + 1))
    echo
  fi

  # Bats tests (requires bats installed)
  bats_files=$(find "$script_test_dir" -not -path '*/.*/*' -name '*.bats' 2>/dev/null || true)
  if [[ -n "$bats_files" ]]; then
    if command -v bats &>/dev/null; then
      echo "=== $skill: bats ==="
      while IFS= read -r f; do
        bats "$f" || EXIT_CODE=1
      done <<< "$bats_files"
      RAN=$((RAN + 1))
      echo
    else
      echo "=== $skill: SKIPPED (bats not installed) ==="
      echo
    fi
  fi

  # TypeScript/JS tests
  ts_files=$(find "$script_test_dir" -not -path '*/.*/*' \( -name '*.test.ts' -o -name '*.test.js' \) 2>/dev/null || true)
  if [[ -n "$ts_files" ]]; then
    echo "=== $skill: vitest ==="
    npx vitest run "$script_test_dir" --reporter=verbose || EXIT_CODE=1
    RAN=$((RAN + 1))
    echo
  fi
done

if [[ $RAN -eq 0 ]]; then
  echo "No script-tests found."
else
  echo "Ran script-tests for $RAN skill(s)."
fi

exit $EXIT_CODE
