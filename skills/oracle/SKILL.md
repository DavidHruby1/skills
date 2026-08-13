---
name: oracle
description: "Use Oracle for second-model review when debugging difficult bugs, challenging architecture or implementation plans, reviewing refactors, or cross-validating decisions with repository files. Don't use unless told to."
---

# Oracle

Oracle bundles a prompt and selected files for an independent model review. Treat its response as advisory and verify all claims against source and tests.

## Preferred OpenCode Workflow

1. Select the smallest file set that contains the necessary context. Never attach secrets, `.env` files, credentials, or private keys.
2. Call the Oracle MCP `consult` tool with `dryRun: true` to inspect the resolved request before spending model time.
3. After confirming scope, call `consult` without `dryRun` and with an explicit `engine` and `model` when available.
4. If a long run detaches or appears to time out, use the MCP `sessions` tool or `oracle status` before retrying. Do not duplicate a running consultation.

API mode requires the corresponding provider key and can incur usage charges. Browser mode requires a supported Chrome installation and a signed-in browser profile.

## CLI Fallback

Preview a bundle without credentials or a model call:

```bash
oracle --dry-run summary --files-report -p "<task>" --file "src/**" --file "!**/*.test.*"
```

Render a bundle for manual use:

```bash
oracle --render -p "<task>" --file "<relevant files>"
```

Check provider readiness without exposing credentials:

```bash
oracle doctor --providers
```

List and recover sessions:

```bash
oracle status --hours 72
oracle session <id> --render
```
