#!/usr/bin/env bash
# Block commits that stage dist/ — build output must stay local.
# .gitignore alone does not untrack files already in git history.

set -u

staged="$(git diff --cached --name-only --diff-filter=ACM | grep -E '^dist(/|$)' || true)"
if [ -n "${staged}" ]; then
  echo "pre-commit-no-dist: refusing commit — dist/ is gitignored build output." >&2
  echo "pre-commit-no-dist: remove from index: git rm -r --cached dist/" >&2
  echo "${staged}" | sed 's/^/  /' >&2
  exit 1
fi

exit 0
