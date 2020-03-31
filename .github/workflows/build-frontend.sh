#!/usr/bin/env bash

rm -rf dist && \
rm -rf node_modules && \
yarn lint && \
yarn install && \
NODE_ENV=prod yarn build
