---
description: "Checks the current changes and commits them. Then when all commits are done, pushes them to the remote repository."
---

I need you to commit the current changes to the repository. If there is more changes that could be separated into more groups of commits, commit them separately.

Don't waste tokens on reading unrelated history. You are supposed to commit as quickly as possible.

## Process

Use **ONLY** these commands:

1. Check what exact files have changed: `git status  --short`
2. Check the changes: `git diff`
3. After the diff inspection, add the changes to stage: `git add`
4. Finally commit the changes: `git commit -m "commit message"`
5. After all commits are done, push: `git push`

If it's the first push on the branch, use: `git push --set-upstream origin <branch_name>`

Use conventional commit messages and keep them concise and simple.
