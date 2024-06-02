#!/bin/bash
cd ../
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
npm cache clean --force
yarn cache clean --mirror
yarn install
yarn add @babel/helper-compilation-targets 