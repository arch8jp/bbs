#!/bin/bash
cd /home/ec2-user/repos/bbs
npm install
npm run build

cp ./hooks/bbs.service /etc/systemd/system/bbs.service
/usr/bin/systemctl enable bbs