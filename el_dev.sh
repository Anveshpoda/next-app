#!/bin/bash

cd /home/anveshpoda/sandbox/MSITE || { echo "Failed to navigate to /home/anveshpoda/sandbox/El_staging/edit_list"; exit 1; }

git fetch --all

git checkout Anvesh_EL

git pull --no-edit origin Anvesh_EL

git status

git push origin el-pre-prod || { echo "Failed to push changes to origin el-pre-prod"; exit 1; }

pm2 reload el-old

exit

