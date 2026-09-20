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

# SYS_ADMIN lets a story run its shell in its own process namespace.
exec docker run --rm --init --cap-add SYS_ADMIN --hostname devbox \
  --cpus "${SCREENS_CPUS:-6}" --memory "${SCREENS_MEMORY:-6g}" --shm-size 1g \
  -v "$PWD":/work/site \
  -v devtools-screens-cache:/cache \
  "$image" "$@"
