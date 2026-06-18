# experimental3 Release Flow

## Test-To-Main Safeguards

- Build features on short-lived feature branches.
- Open pull requests into `test` first.
- Require the `MDS PR Checks` workflow to pass before merging into `test`.
- Smoke test the app from `test` with staging data and staging Supabase keys when Supabase is used.
- Promote from `test` to `main` only after validation.
- Protect `main` so direct pushes are blocked and PR checks are required.

## Current Alignment Status

- Local CI workflow: present in `.github/workflows/mds-pr-checks.yml`
- Verification command used by CI: `npm run ci:verify`
- Production-build gate used by CI: `npm run build:prod`
- Current local branches: `main` only
- Current git remote: not configured yet
- Result: CI wiring matches the planned flow locally, but branch protection and
  enforcement still depend on the later GitHub setup tasks.

## Supabase Environments

- Local dummy data is the starting point.
- When Supabase is introduced, create separate test/staging and production projects before wiring production data.

## GitHub Setup The User Still Needs To Do

- Create `test` and `main` branches.
- Confirm GitHub Actions is enabled for the repo and that the generated workflow is allowed to run.
- In GitHub branch protection, require pull requests and status checks for `test` and `main`.
- Require the generated `MDS PR Checks` workflow before merge.
- If the agent has GitHub access with enough permissions, let it apply these repo settings for you; otherwise do this one-time setup in the GitHub UI.
