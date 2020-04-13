#!/usr/bin/env bash

rm -rf build
rm -rf node_modules
yarn install
yarn lint
yarn test-mobile
yarn test-desktop
NODE_ENV=prod yarn build
