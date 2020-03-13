#!/usr/bin/env bash

if [[ -n "$TOKEN" ]]; then
    GITHUB_TOKEN=$TOKEN
fi

if [[ -z "$TOKEN" ]]; then
    echo "Set the TOKEN env variable."
    exit 1
fi

if [[ -z "$GITHUB_REPOSITORY" ]]; then
    echo "Set the GITHUB_REPOSITORY env variable."
    exit 1
fi

REPO="https://${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

GIT_REV="$(git rev-parse HEAD)"&& \
rm -rf dist && \
rm -rf node_modules && \
npm install && \
NODE_ENV=prod yarn build && \
cd build/ && \
git init && \
git config user.name "GitHub Actions" && \
git config user.email "github-actions-bot@users.noreply.github.com" && \
git remote add origin "${REPO}" && \
git checkout -b gh-pages && \
git add * && \
git commit -m "patternlayout ${GIT_REV} deployment to gh-pages" && \
git fetch && git rebase -s recursive -Xtheirs origin/gh-pages && \
git push origin gh-pages