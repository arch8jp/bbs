#!/bin/sh

cd /home/ec2-user/repos/bbs
forever stop bbs || true
PORT=3100 forever start -a --uid bbs --minUptime 10000ms --spinSleepTime 10000ms server/index.js