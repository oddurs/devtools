#!/usr/bin/env bash
# Shoot and record projects in the screens container. See screens/README.md.
#
#   scripts/screens.sh                    all projects with a story
#   scripts/screens.sh caligula cornell   just these
#   scripts/screens.sh --rebuild-image …  rebuild the image first
#
# Limits: SCREENS_CPUS (default 6) and SCREENS_MEMORY (default 6g).
set -euo pipefail
cd "$(dirname "$0")/.."

image=devtools-screens
if [ "${1:-}" = "--rebuild-image" ]; then
  shift
  docker build -t "$image" screens
elif ! docker image inspect "$image" >/dev/null 2>&1; then
  docker build -t "$image" screens
fi

# Repos, build targets and lossless PNGs persist here between runs.
docker volume create devtools-screens-cache >/dev/null

# One tool reads GitHub rather than the filesystem (rigor asks `gh` for pull
# requests), so the rig needs a token. It borrows this machine's, the same way
# rigor itself does — no secret file, nothing to commit, nothing to rotate. It
# is passed by env rather than on the command line, so it never reaches `ps`,
# and the runner hands it only to stories that declare `github: true`.
gh_token="$(gh auth token 2>/dev/null || true)"
if [ -z "$gh_token" ]; then
  echo "note: gh is not authenticated here, so stories that read GitHub will be skipped" >&2
fi

# SYS_ADMIN lets a story run its shell in its own process namespace.
exec docker run --rm --init --cap-add SYS_ADMIN --hostname devbox \
  --cpus "${SCREENS_CPUS:-6}" --memory "${SCREENS_MEMORY:-6g}" --shm-size 1g \
  -e GH_TOKEN="$gh_token" \
  -v "$PWD":/work/site \
  -v devtools-screens-cache:/cache \
  "$image" "$@"
