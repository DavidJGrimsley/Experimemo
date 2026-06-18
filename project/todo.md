# experimental3 TODO

## Phase 0: Orientation And Planning

- [x] Review `project/` files for accuracy and planning adjustments
- [x] Browse exposition pages to understand the included starter flows, package demos, and MDS scaffolding
- [x] Run `mds eject exposition` and keep only the generated sections you want to retain
- [x] Keep or prune included package examples after reviewing `/exposition`
- [x] Remove exposition pages before production once their lessons are absorbed
- [x] Review styling in the 'Stylist' page and pressure-test the starter theme before building product screens
- [x] Run or defer `eject-stylist`; mark this todo done after ejection or deciding to keep it longer for design iteration
- [x] Confirm visual direction in `project/style.md` after reviewing the Stylist page
- [x] Sign in and set up EAS in the terminal
- [x] Confirm `project/info.md` did not change materially during Phase 0, so no roadmap refresh is needed yet

## Phase 1: App Shell And First Flow

- [x] Establish the app shell and first implementation-ready route in src/app
- [x] Implement the first core user flow: Create an experiment
- [x] Build the first screens or routes needed for the MVP flow: New (create new experiment), Track (list of past experiments), and Settings
- [x] Scope the first feature modules around: Track multiple experiments, each with its own hypothesis, procedure, data collection, and results, View and edit existing experiments, and Add pictures and notes to experiments

## Phase 2: Data Layer

- [x] Implement the initial data layer using local dummy data with Expo SQLite
- [x] Design the initial data layer and service boundaries for: Local UI/app state, image uploads and local dummy data with Expo SQLite
- [x] Plan file and media upload flows, storage ownership, and failure handling

## Phase 3: Complete Product Flows

- [x] Adapt the working MVP flow for the remaining target platforms after the primary flow is stable: android
- [x] Configure EAS for Building mobile apps

## Phase 4: Polish, Safeguards, And Release

- [x] Prepare store/distribution packaging, review notes, and release validation for the chosen delivery path
- [x] Confirm branch protection, CI checks, and release gating match the planned ship workflow
- [x] Run `mds doctor --ci` and address errors
- [ ] Follow `project/release-flow.md` for test-to-main development
- [ ] Complete the one-time GitHub repo setup from `project/release-flow.md` so `test` and `main` are protected correctly
- [ ] Add GitHub branch protection so PR checks pass before merging into `test` or `main`
- [x] Prepare the release flow for: App Store and test-to-main safeguards
- [ ] Close or explicitly defer the remaining open questions before production release
