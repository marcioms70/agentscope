#!/bin/sh
set -eu

# Fail closed: never serve the UI or API gateway without credentials.
if [ -z "${AGENTSCOPE_BASIC_AUTH_USER:-}" ] || [ -z "${AGENTSCOPE_BASIC_AUTH_PASSWORD:-}" ]; then
    echo "ERROR: Set AGENTSCOPE_BASIC_AUTH_USER and AGENTSCOPE_BASIC_AUTH_PASSWORD in Coolify." >&2
    exit 1
fi

umask 077
htpasswd -bcB /etc/nginx/.htpasswd "$AGENTSCOPE_BASIC_AUTH_USER" "$AGENTSCOPE_BASIC_AUTH_PASSWORD" > /dev/null

# nginx runs worker processes as the nginx user, not root.
# Allow its group to read the bcrypt password file without exposing it to all users.
chown root:nginx /etc/nginx/.htpasswd
chmod 640 /etc/nginx/.htpasswd

exec nginx -g 'daemon off;'
