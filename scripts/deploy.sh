#!/usr/bin/env bash
set -euo pipefail

MESSAGE="${*:-Update Skool Game}"
LIVE_URL="https://skool-game.vercel.app"

echo "Building Skool Game..."
npm run build

echo
echo "Checking local changes..."
git status --short

echo
echo "Staging app files..."
git add README.md AGENTS.md .gitignore package.json package-lock.json tsconfig.json next-env.d.ts public src docs scripts

if git diff --cached --quiet; then
  echo
  echo "No staged changes to deploy."
  echo "If the live site still looks old, check the latest Vercel deployment or refresh the browser cache."
  echo "Live site: $LIVE_URL"
  exit 0
fi

echo
echo "Committing: $MESSAGE"
git commit -m "$MESSAGE"

echo
echo "Pushing to GitHub..."
git push

echo
echo "Done. Vercel should deploy automatically from GitHub."
echo "Wait about 30-90 seconds, then open: $LIVE_URL"
