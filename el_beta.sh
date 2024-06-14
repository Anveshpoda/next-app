#!/bin/bash

cd /home/anveshpoda/sandbox/El_staging || { echo "Failed to navigate to /home/anveshpoda/sandbox/El_staging/edit_list"; exit 1; }

extract_jira_id() {
  echo "$1" | grep -oP '(?<=JIRA-)[A-Z0-9-]+'
}

git fetch --all

git pull --no-edit origin el-pre-prod

Lid=$(git show -s --format=%B $(git rev-parse origin/el-dev))
echo $Lid

jiraId=$(extract_jira_id "$Lid")


if [ -z "$jiraId" ]; then
  echo "No valid JIRA ID found in the last commit message on el-dev."
  exit 0
  # jiraId="default-merge-message"
else
  echo "Extracted JIRA ID: JIRA-$jiraId"
fi

echo "______________________________________________________________"

changes_detected=false
if ! git diff --quiet origin/el-dev -- edit_list/src/; then
  changes_detected=true
fi

# if ! git diff --exit-code origin/el-dev -- edit_list/src/ &>/dev/null; then
#   changes_detected=true
# fi


# merge_output=$(git merge origin/el-dev -m "JIRA-$jiraId : Merge el-dev into current branch")
# pull_output=$(git pull origin el-dev)
# pull_output=$(git pull --no-edit origin el-dev)

if ! git pull --ff-only origin el-dev; then
  echo "Fast-forward update failed. Performing a merge."

  git merge origin/el-dev -m "JIRA-$jiraId : Merge el-dev into current branch"
  
  if [[ "$?" != 0 ]]; then
    echo "Merge conflict detected. Please resolve conflicts and commit manually."
    exit 0
  fi
fi


# if [[ "$(git pull --ff-only origin el-dev)" == *"Already up to date."* ]] || [[ "$(git pull --ff-only origin el-dev)" == *"Already up-to-date."* ]] || [[ "$(git pull --ff-only origin el-dev)" == *"Everything up-to-date."* ]]; then
#   echo "Already up-to-date. Exiting."
#   exit 0
# fi

echo "______________________________________________________________"



if [ "$changes_detected" = false ]; then
  echo "No changes detected in src/ after pull or merge. No build necessary."
else
  echo "Changes detected in src/. Running build."

  cd edit_list

  npm run build --color=always | tail -n 80

  # npm run build > build.log
  # tail -n 100 build.log

  cd ..

  git add -A

  git commit -m "JIRA-$jiraId build updated"

fi

echo "______________________________________________________________"

git status

# git push origin el-pre-prod || { echo "Failed to push changes to origin el-pre-prod"; exit 1; }


exit

