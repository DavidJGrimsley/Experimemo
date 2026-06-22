# experimemo TODO

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
- [x] Follow `project/release-flow.md` for test-to-main development
- [x] Complete the one-time GitHub repo setup from `project/release-flow.md` so `test` and `main` are protected correctly
- [x] Add GitHub branch protection so PR checks pass before merging into `test` or `main`
- [x] Prepare the release flow for: App Store and test-to-main safeguards
- [x] Close or explicitly defer the remaining open questions before production release

## Extra Changes to MVP
- [x] Replace everything possible with universal components from Expo UI and use nativetabs from Expo UI as well for the tab navigator.
- [x] Remove developer facing notes and todos from the app screens - make all copy user-facing.
- [x] Remove 'what the results field means' view from create page
- [x] in the experiment [id] page, Add a toggle to mark experiments as complete and move them to a completed section in the track page
- [x] The experiment [id] page has header issues, too large and doesn't say the name of the experiment but the name may be too long so let's just leave that blank and have the experiment name as the title to replace 'edit experiment'.
- [x] Remove the settings tab
- [x] Put an info circle icon in the header which should open up a large modal with settings, about, and feedback sections. Settings will contain 'Delete Experiments' and 'Reset App' buttons, which will allow the user to delete experiments from a list or reset the entire app data. The about section will have info about the dev (me) and the feedback section will have a link to the GitHub repo and instructions for how to submit feedback and issues.
- [x] the 'Experiment' needs work. specifically, the results section. Let's just rename that to only 'Observations' but below that we should have a section for Results which will be more dynamic and allow the user to track multiple result entries with a date and time and notes and photos for each result entry. This will allow the user to track the experiment over time and have a more complete picture of how it went.
- [x] Add a 'Conclusion' section below Field Notes
- [x] Add the ability to take pictures from the add photo button instead of just uploading from the library like most apps do.
- [x] Fix issue where the view border colors are sometimes orange instead of green. 
- [x] Update the app to use the urls of: https://davidjgrimsley.com/experimemo/support, https://davidjgrimsley.com/experimemo/terms, and https://davidjgrimsley.com/experimemo/privacy for the support URL, terms of service URL, and privacy policy URL respectively. 
- [ ] The preloaded example experiments aren't in the delete list. Add them to the db so they can be deleted by the user without resetting the app and possibly their data which is currently the only way to do so. Also add '(Example)' to the title of the preloaded experiments so the user can easily identify them as examples. 

## Future Considerations (post-MVP)
- [ ] Add a 'control' field to the experiments and possibly a toggle for 'the scientific method' which will add the control field and possibly change the layout of the create and experiment pages to reflect the different flow of the scientific method. This is a common framework for conducting experiments and it would be helpful to have it built into the app for users who want to follow that structure. The current flow is more of a simple experiment/observation tracker which is fine. 
