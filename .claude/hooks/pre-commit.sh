#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.command // ""')

# Only run on git commit commands
if ! echo "$COMMAND" | grep -qE "git commit"; then
  exit 0
fi

cd /Users/hyoon/Lab/fs-vibe-coding-p1c1

echo "🔍 Lint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Lint failed — commit aborted"
  exit 2
fi

echo "🧪 Test..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Test failed — commit aborted"
  exit 2
fi

echo "✅ All checks passed"
exit 0
