#!/bin/bash
cd /home/ec2-user/repos/bbs
API_URL=https://bbs.arch8.jp
npm install
npm run build

cp ./hooks/bbs.service /etc/systemd/system/bbs.service
/usr/bin/systemctl enable bbs