# experimental3 Guidelines

## MDS Template Baseline

This file was copied from the bundled MDS `guidelines.md` template. Customize
it for the app before treating it as final.

## Source Of Truth

- The `project/` folder is the golden source of truth for product intent,
  roadmap, visual style, and technical rules.
- Agents and contributors must read `project/info.md`, `project/todo.md`,
  `project/style.md`, and this file before making product or architecture
  changes.
- Never make a change that conflicts with the project memory files unless the
  user explicitly updates them first.

## TodoForContext Markers Block Onboarding

- The string `# TodoForContext(optional):` marks sections the user has not
  yet decided about.
- Before agentic intake, planning, or scaffolding, scan every `project/`
  file for this marker.
- If any marker is present: stop, list each file and line, and tell the
  user to fill the section underneath OR delete the marker line to
  acknowledge they do not want to add that context.
- Only proceed when zero markers remain. `mds doctor` also surfaces this
  as an error that blocks CI.

## Product Context

- Audience: Scientists and people learning how to conduct experiments
- Core flows: create experiments, review and edit experiments, capture notes and photos, organize experiments, and search/filter records
- Data needs: local UI/app state, file/image uploads or storage, and local dummy data with Expo SQLite
- Deployment target: App Store
- Target platforms: ios, android
- First MVP platform: ios
- Expo Router app directory: `src/app`
- Platform-specific organization: platform-specific files only
- Platform layout mode: shared layouts
- Web output: none
- Deployed server: no deployed server planned
- Advanced package setup: yes
- Create Expo starter components: yes
- Expo UI: yes
- Expo UI Universal components: yes
- Expo Native Tabs: yes
- Data start: local dummy data with Expo SQLite
- Test-to-main safeguards: yes
- EAS usage: building mobile applications

## Expo Architecture

- Keep Expo Router route files thin; route files should import feature screens
  or layouts.
- Put reusable business logic in `src/features`, `src/services`, `src/data`, or
  shared hooks.
- Keep Expo Router routes in `src/app` unless project memory changes.
- Use shared layouts for selected platform shells.
- Keep the generated NativeWindUI setup as the styling baseline unless the project memory is intentionally updated to migrate away from it.
- Use Zustand only when state is shared across screens or features.
- Keep private environment variables server-side and never expose secrets with
  `EXPO_PUBLIC_`.

## Data Layer Notes

- `src/services/local-data.ts` and `src/services/local-data.native.ts` are the
  current experiment data boundary. Feature screens should not talk to Expo
  SQLite directly.
- Native builds store experiment metadata in the local SQLite `experiments`
  table. Web keeps a dummy in-memory fallback with the same contract so the app
  remains runnable everywhere.
- Treat experiment records as the source of truth for title, hypothesis,
  procedure, data plan, results, notes, planned photo count, and attached photo
  URI metadata.
- Attached photos currently persist as picker URI metadata on the experiment
  record so the MVP can reopen and review selected images without a remote media
  backend.
- Binary media ownership is still future work. Keep failure handling explicit: a
  record save must still succeed even if a later photo attach or file-copy step
  fails.
- Any future media flow should define ownership clearly: experiment metadata in
  SQLite, media files in app storage, and recoverable links between them.

## Default Package Support

- Software Mansion core support starts with Reanimated/Worklets, Gesture
  Handler, Screens, SVG, and Keyboard Controller.
- The starter exposition pages were reviewed during Phase 0 and intentionally
  removed. Do not restore them unless the project memory changes.
- Use `react-native-keyboard-controller` for real keyboard-heavy flows instead
  of piling up manual keyboard offsets.
- Use Reanimated for meaningful motion, but avoid expensive animation loops in
  long lists.

## Workflow

- Run `mds doctor --ci` before pushing.
- Use `mds clear-expo-start` when Metro or server ports get wedged.
- When enabled, develop through feature branches into `test`, then promote
  validated work from `test` to `main`.
- Treat monorepo scaffolding as future work until the single-app MVP is stable.

## Selected Defaults

- project-docs
- guidelines
- nativewindui
- doctor
- test-to-main
