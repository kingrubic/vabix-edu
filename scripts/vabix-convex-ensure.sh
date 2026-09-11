#!/bin/zsh
# Keep the VABIX Convex anonymous local backend on :3212.
# LaunchAgent: ai.vabix.edu.convex
set -euo pipefail
umask 077

readonly REPO="/Users/vsc_agent/projects/vabix"
readonly NODE_BIN="/Users/vsc_agent/.nvm/versions/node/v22.23.0/bin"
readonly CONVEX="$REPO/node_modules/.bin/convex"
readonly HEALTH_URL="http://127.0.0.1:3212/version"
readonly CHECK_INTERVAL_SEC="${VABIX_CONVEX_ENSURE_INTERVAL:-15}"

export PATH="${NODE_BIN}:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export HOME="/Users/vsc_agent"

if [[ ! "$CHECK_INTERVAL_SEC" =~ ^[0-9]+$ ]] || (( CHECK_INTERVAL_SEC < 1 || CHECK_INTERVAL_SEC > 3600 )); then
  print -u2 -- "VABIX_CONVEX_ENSURE_INTERVAL must be an integer from 1 to 3600 seconds"
  exit 64
fi

cd "$REPO"

log() {
  print -r -- "$(date '+%Y-%m-%dT%H:%M:%S%z') $*"
}

backend_healthy() {
  curl -fsS --max-time 5 "$HEALTH_URL" >/dev/null 2>&1
}

trap 'log "stopping vabix-convex-ensure"; exit 0' INT TERM

if [[ ! -x "$CONVEX" ]]; then
  log "ERROR: missing Convex CLI at $CONVEX"
  exit 1
fi

log "vabix-convex-ensure started interval=${CHECK_INTERVAL_SEC}s"

while backend_healthy; do
  log "backend already healthy on 3212; waiting to adopt"
  sleep "$CHECK_INTERVAL_SEC"
done

log "starting convex dev"
exec "$CONVEX" dev
