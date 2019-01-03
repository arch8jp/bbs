#!/bin/sh
source /home/ec2-user/.bashrc
cd /home/ec2-user/repos/bbs
pm2 start pipeline/pm2.json