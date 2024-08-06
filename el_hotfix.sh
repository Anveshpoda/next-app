#!/bin/bash

cd /home/anveshpoda/sandbox/El_staging || { echo "Failed to navigate to /home/anveshpoda/sandbox/El_staging/edit_list"; exit 1; }

extract_jira_id() {
  echo "$1" | grep -oP '(?<=JIRA-)[A-Z0-9-]+'
}

git fetch --all

git pull --no-edit origin el-hotfix

Lid=$(git show -s --format=%B $(git rev-parse origin/el-hotfix))
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

# changes_detected=false
# if ! git diff --quiet origin/el-hotfix -- edit_list/src/; then
#   changes_detected=true
# fi

# echo "______________________________________________________________"


# if [ "$changes_detected" = false ]; then
#   echo "No changes detected in src/ after pull or merge. No build necessary."
# else
  echo "Running build."

  cd edit_list

  # npm run build --color=always | tail -n 80

  cd ..

  git add -A

  git commit -m "JIRA-$jiraId build updated"

# fi

# echo "______________________________________________________________"

git status

git push origin el-hotfix || { echo "Failed to push changes to origin el-pre-prod"; exit 1; }


echo "_________________________ PUSHING TO PRE-PROD ______________________________"

git checkout origin pre-prod

git branch

git pull --no-edit origin pre-prod

if ! git pull --ff-only origin el-hotfix; then
  echo "Fast-forward update failed. Performing a merge."

  git merge origin/el-hotfix -m "JIRA-$jiraId : Merge el-hotfix into current branch"
  
  if [[ "$?" != 0 ]]; then
    echo "Merge conflict detected. Please resolve conflicts and commit manually."
    exit 1
  fi
fi

git checkout origin el-hotfix


exit

