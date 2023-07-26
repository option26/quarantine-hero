#!/usr/bin/env bash
# exit script as soon as any command returns non-zero
set -e

GIT_REV="$(git rev-parse HEAD)"
FIREBASE_PROJECT="quarantine-hero"
FIREBASE_MESSAGE="QH $GIT_REV deployment to firebase"
# deploy here because npm does not resolve environment variables in npm run
npx firebase-tools@8 deploy --only functions --project "$FIREBASE_PROJECT" -m "$FIREBASE_MESSAGE" --non-interactive
npx firebase-tools@8 deploy --only firestore --project "$FIREBASE_PROJECT" -m "$FIREBASE_MESSAGE" --non-interactive
