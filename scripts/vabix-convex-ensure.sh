#!/bin/zsh
# Platform + MyBizCar Convex now use cloud prod:accomplished-rabbit-409.
# Local ensure is intentionally a no-op to avoid ECONNREFUSED :3212.
echo "$(date -Iseconds) vabix-convex-ensure: cloud mode — no local convex process"
# Stay alive idle so KeepAlive doesn't thrash; sleep forever with periodic heartbeat
while true; do
  sleep 3600
  echo "$(date -Iseconds) heartbeat cloud-mode"
done
