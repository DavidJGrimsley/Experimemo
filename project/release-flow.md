# experimemo Release Flow

## Test-To-Main Safeguards

- Build features on short-lived feature branches.
- Open pull requests into `test` first.
- Require the `MDS PR Checks` workflow to pass before merging into `test`.
- Smoke test the app from `test` with staging data and staging Supabase keys when Supabase is used.
- Promote from `test` to `main` only after validation.
- Protect `main` so direct pushes are blocked and PR checks are required.

## Current Alignment Status

- Local GitHub verification workflow: present in `.github/workflows/mds-pr-checks.yml`
- Verification command used by CI: `npm run ci:verify`
- Local release-readiness gate: `npm run build:prod`
- EAS project linkage: complete in `app.json` with project ID
  `42ce5672-ed79-4d7c-878c-ad49f7cce353`
- EAS build config: present in `eas.json`
- GitHub-to-EAS release workflows:
  - `test` pushes trigger `.github/workflows/eas-testflight.yml`
  - `main` pushes trigger `.github/workflows/eas-production-builds.yml`
- Result: repo-side CI and release automation files are in place; the remaining
  work is one-time Expo, Apple, and GitHub secret setup.

## Release Automation Shape

- `test` branch:
  - GitHub Actions runs an iOS EAS build with the `testflight` profile
  - The same run auto-submits that build to TestFlight
- `main` branch:
  - GitHub Actions runs EAS production builds for both iOS and Android
  - Keep store submission manual until App Store Connect and Play Console
    credentials are fully confirmed

## Supabase Environments

- Local dummy data is the starting point.
- When Supabase is introduced, create separate test/staging and production projects before wiring production data.

## GitHub Setup The User Still Needs To Do

- Confirm GitHub Actions is enabled for the repo and that the generated workflow
  is allowed to run.
- Add an `EXPO_TOKEN` repository secret from
  https://expo.dev/settings/access-tokens.
- In GitHub branch protection or rulesets, require pull requests and status
  checks for `test` and `main`.
- Require the generated `MDS PR Checks` workflow before merge.

## Remaining One-Time EAS And Store Setup

- Run a first successful local iOS store build:
  `npx eas-cli@latest build --platform ios --profile testflight`
- Run a first successful local Android production build:
  `npx eas-cli@latest build --platform android --profile production`
- App Store Connect app record for `experimemo` is already created with app ID
  `6781789138`.
- In Expo credentials or the EAS dashboard, connect your Apple team and App Store
  Connect API key so TestFlight submissions can run non-interactively.
- After the first successful manual build and TestFlight upload, push to `test`
  to verify the GitHub Action end-to-end.
