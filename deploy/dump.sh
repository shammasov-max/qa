#!/bin/bash
DIR=`date +%d-%m-%y`
DEST=/dumps/godj/$DIR
mkdir -p $DEST
FILE=$DEST/archive.gz
echo $FILE
mongodump -h localhost:27017 -d godj -u root -p BuildMeUp --authenticationDatabase admin --archive=$FILE
rm -rf  /dumps/godj/last

cp -r $DEST /dumps/godj/last
