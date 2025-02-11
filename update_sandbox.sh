#!/bin/bash
#
# update_sandbox.sh
#
# Usage:
#   ./update_sandbox.sh -r <repo_directory> -p <pm2_process_name> -H <remote_host> [-u <ssh_username>] [-w <ssh_password>]
#
# Defaults:
#   repo_directory: /home/anveshpoda/sandbox/MSITE
#   pm2_process_name: el_old
#

# Default values
DEFAULT_REPO_DIR="/home/anveshpoda/sandbox/MSITE"
DEFAULT_PM2_PROCESS="el_old"

# Initialize variables with defaults
REPO_DIR="$DEFAULT_REPO_DIR"
PM2_PROCESS="$DEFAULT_PM2_PROCESS"
REMOTE_HOST=""
SSH_USER=""
SSH_PASS=""

# Parse command-line options
while getopts "r:p:H:u:w:" opt; do
  case $opt in
    r) REPO_DIR="$OPTARG" ;;
    p) PM2_PROCESS="$OPTARG" ;;
    H) REMOTE_HOST="$OPTARG" ;;
    u) SSH_USER="$OPTARG" ;;
    w) SSH_PASS="$OPTARG" ;;
    *) echo "Usage: $0 -r <repo_directory> -p <pm2_process_name> -H <remote_host> [-u <ssh_username>] [-w <ssh_password>]" >&2
       exit 1 ;;
  esac
done

# Ensure a remote host is specified
if [ -z "$REMOTE_HOST" ]; then
  echo "ERROR: Remote host must be specified using the -H option."
  exit 1
fi

# Build the SSH target
if [ -n "$SSH_USER" ]; then
  TARGET="$SSH_USER@$REMOTE_HOST"
else
  TARGET="$REMOTE_HOST"
fi

# The update commands to execute remotely
REMOTE_COMMANDS=$(cat <<'EOF'
echo "=== Starting sandbox update on remote host ==="

if cd "$REPO_DIR"; then
  echo "Navigated to repository directory: $REPO_DIR"
else
  echo "ERROR: Failed to navigate to repository directory: $REPO_DIR"
  exit 1
fi

echo "Fetching the latest updates from remote..."
if ! git fetch --all; then
  echo "ERROR: Failed to fetch updates from remote"
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"
echo "Pulling the latest changes from origin/$CURRENT_BRANCH..."
if ! git pull --no-edit origin "$CURRENT_BRANCH"; then
  echo "ERROR: Failed to pull the latest changes from origin/$CURRENT_BRANCH"
  exit 1
fi

git status

if pm2 list | grep -q "$PM2_PROCESS"; then
  echo "Reloading PM2 process: $PM2_PROCESS"
  if ! pm2 reload "$PM2_PROCESS"; then
    echo "ERROR: Failed to reload PM2 process: $PM2_PROCESS"
    exit 1
  fi
else
  echo "PM2 process '$PM2_PROCESS' not found; skipping reload."
fi

echo "=== Sandbox update completed successfully ==="
EOF
)

# Connect to the remote host and execute the commands
if [ -n "$SSH_PASS" ]; then
  echo "Connecting to remote host: $TARGET using sshpass..."
  sshpass -p "$SSH_PASS" ssh "$TARGET" "bash -s" <<EOF
export REPO_DIR="$REPO_DIR"
export PM2_PROCESS="$PM2_PROCESS"
$REMOTE_COMMANDS
EOF
  exit $?
else
  echo "Connecting to remote host: $TARGET..."
  ssh "$TARGET" "bash -s" <<EOF
export REPO_DIR="$REPO_DIR"
export PM2_PROCESS="$PM2_PROCESS"
$REMOTE_COMMANDS
EOF
  exit $?
fi
