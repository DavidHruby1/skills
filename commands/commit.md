---
description: "Checks the current changes and commits them."
---

I need you to commit the current changes to the repository.

Don't waste tokens on reading unrelated history. You are supposed to commit as quickly as possible.

## Process

Use **ONLY** these commands:

1. Check what exact files have changed: `git status  --short`
2. Check the changes: `git diff`
3. After the diff inspection, add the changes to stage: `git add`
4. Finally commit the changes: `git commit -m "commit message"`

Use conventional commit messages and keep them concise and simple.
