#!/usr/bin/env bash

cd ./firebase/functions && \
rm -rf node_modules && \
npm install && \
npm run lint
