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

echo " "
echo " "
echo "______________________________________________________________"
echo " "
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

  npm run build --color=always | tail -n 100 || { echo "Build Failed"; exit 1; }
  # npm run build || { echo "Build Failed"; exit 1; }

  cd ..

  git add -A

  git commit -m "JIRA-$jiraId build updated"

# fi

# echo "______________________________________________________________"

git status

git push origin el-hotfix || { echo "Failed to push changes to origin el-pre-prod"; exit 1; }

echo " "
echo " "
echo "_________________________ COPY LIVE BUILD TO project01.anveshpoda.blrsoftware.jd ______________________________"
echo " "

# rsync -ah -J --exclude='node_modules' --exclude='package.json' --exclude='src' --exclude='public' ./edit_list/ ../project01/MSITE/edit_list
# rsync -ah -J --exclude='node_modules' --exclude='package.json' --exclude='src' ./edit_list/ ../project01/edit_list

rsync -ah -J --exclude='node_modules' --exclude='package.json' --exclude='src' --exclude='public' --delete ./edit_list/ ../project01/MSITE/edit_list
rsync -ah -J --exclude='node_modules' --exclude='package.json' --exclude='src' --delete ./edit_list/ ../project01/edit_list

echo " Build Copied Successfully. Check your changes in below PORT"
echo " http://project01.anveshpoda.blrsoftware.jd/MSITE/edit_list/index.php"

echo " "
echo " "
echo "_________________________ GETTING UNIQUE JIRA IDs WITH URLS FROM el-hotfix ______________________________"
echo " "

commit_messages=$(git log origin/master..origin/el-hotfix --pretty=format:"%B")

extract_unique_jira_ids() {
  echo "$1" | grep -oP '(?<=JIRA-)[A-Z0-9-]+' | sort | uniq
}

unique_jira_ids=$(extract_unique_jira_ids "$commit_messages")

output_file="/home/anveshpoda/sandbox/next-app/logs/hotfix_jira_urls.log"

> "$output_file"

if [ -z "$unique_jira_ids" ]; then
  echo "No unique JIRA IDs found in the commits to be merged."
else
  echo "JIRA IDs to be merged:"
  while IFS= read -r id; do
    url="https://jdjira.justdial.com/browse/$id"
    echo "$url" | tee -a "$output_file"
  done <<< "$unique_jira_ids"
fi


echo " "
echo " "
echo "____________________________ PUSHING TO PRE-PROD ________________________________"
echo " "

git checkout pre-prod

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

git status

git push origin pre-prod || { echo "Failed to push changes to origin el-pre-prod"; exit 1; }

git checkout el-hotfix


exit

