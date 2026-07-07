#!/usr/bin/env bash
# Install local git hooks for freetoolonline-web-test (idempotent).

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="${ROOT}/.git/hooks"
SRC="${ROOT}/scripts/git-hooks/pre-commit-no-dist.sh"
DEST="${HOOKS_DIR}/pre-commit"

if [ ! -d "${HOOKS_DIR}" ]; then
  echo "install-git-hooks: ${ROOT} is not a git repo — skipping." >&2
  exit 0
fi

cp "${SRC}" "${DEST}"
chmod +x "${DEST}"
echo "install-git-hooks: installed ${DEST} (blocks dist/ commits)"
