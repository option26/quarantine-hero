#!/usr/bin/env bash
# exit script as soon as any command returns non-zero
set -e

if [[ -z "$FIREBASE_TOKEN" ]]; then
    echo "Set the FIREBASE_TOKEN env variable."
    exit 1
fi

GIT_REV="$(git rev-parse HEAD)"
FIREBASE_PROJECT="quarantine-hero"
FIREBASE_MESSAGE="QH $GIT_REV deployment to firebase"
# deploy here because npm does not resolve environment variables in npm run
npx firebase-tools deploy --only functions --project "$FIREBASE_PROJECT" -m "$FIREBASE_MESSAGE" --non-interactive
npx firebase-tools deploy --only firestore --project "$FIREBASE_PROJECT" -m "$FIREBASE_MESSAGE" --non-interactive
