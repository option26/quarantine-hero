#!/usr/bin/env bash

rm -rf dist && \
rm -rf node_modules && \
yarn install && \
yarn lint && \
NODE_ENV=prod yarn build
