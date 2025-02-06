#!/bin/bash

# TARGET_DIR="/home/anveshpoda/sandbox/EL"
# DESIRED_BRANCH="dev"
# PM2_APP_NAME="EL"

TARGET_DIR="$1"     # Accept dynamic TARGET_DIR
DESIRED_BRANCH="$2" # Accept dynamic DESIRED_BRANCH
PM2_APP_NAME="$3"   # Accept dynamic PM2_APP_NAME


cd "$TARGET_DIR" || { echo "Error: Failed to change directory to $TARGET_DIR"; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Error: Not a git repository"; exit 1; }

git fetch --all

# Check current branch
#CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$DESIRED_BRANCH" ]; then
    echo "Error: Current branch is $CURRENT_BRANCH (should be $DESIRED_BRANCH)"
    exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
    echo "Error: There are uncommitted changes in the repository"
    exit 1
fi

# Pull latest changes
echo "Pulling latest code from $DESIRED_BRANCH branch..."
git pull origin "$DESIRED_BRANCH" || { echo "Error: Failed to pull code"; exit 1; }

# Reload PM2 application
echo "Reloading PM2 application..."
pm2 reload "$PM2_APP_NAME" || { echo "Error: Failed to reload PM2 application"; exit 1; }

echo "Deployment completed successfully"