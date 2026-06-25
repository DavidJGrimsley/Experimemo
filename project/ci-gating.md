# experimemo CI And Release Gating

## Current Local Alignment

- The repo includes a GitHub Actions workflow named `MDS PR Checks`.
- That workflow runs on:
  - pull requests targeting `test`
  - pull requests targeting `main`
  - pushes to `test`
  - manual `workflow_dispatch`
- The workflow uses `npm ci` and runs `npm run ci:verify`, which resolves to
  `mds doctor --ci`.
- The doctor CI path now resolves its production-build step through
  `npm run build:prod`, which is intentionally defined as a native release-
  readiness gate for this mobile-only app instead of a web export.

## What This Confirms

- The project has a local CI workflow that matches the intended `test`-to-`main`
  release model described in `project/release-flow.md`.
- The required verification entrypoint is centralized in `package.json` through
  `ci:verify`, so local and GitHub validation use the same command.
- The workflow is deterministic because it installs from the lockfile instead of
  a floating dependency install.

## Current Gaps

- Only the local `main` branch exists right now.
- No git remote is configured yet, so GitHub branch protection cannot be applied
  from this repo state.
- The planned release gating cannot be fully enforced until:
  - a remote repository exists
  - a `test` branch exists on that remote
  - GitHub branch protection rules are configured for `test` and `main`

## Practical Next Steps

- Create the remote repository if it does not exist yet.
- Push both `main` and `test` branches.
- Enable GitHub Actions for the repo.
- Require `MDS PR Checks` before merging into `test` or `main`.
- Block direct pushes to protected branches once the remote workflow is live.
