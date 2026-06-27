# Experimemo App Store Release Prep

## Chosen Delivery Path

- Primary release target: Apple App Store on iPhone first.
- Android remains a supported platform, but store packaging can follow after the
  iOS submission path is validated.
- EAS project linkage is now complete, and branch-based workflow files are ready
  for `test` and `main` through GitHub Actions.

## Current Packaging Snapshot

- App display name in config: `Experimemo`
- Scheme and slug: `experimemo`
- Marketing version: `1.0.0`
- iOS bundle identifier: `mrdj2u.experimemo`
- Android package name: `mrdj2u.experimemo`
- iOS build number: `1`
- Android version code: `1`
- Orientation: portrait
- iOS tablet support: enabled
- App icons already present in `assets/icon.png`, `assets/adaptive-icon.png`,
  and `assets/splash.png`
- Photo-library permission copy is already defined for experiment image
  attachments
- No account system, analytics, purchases, or deployed backend are currently in
  scope

## Store Metadata Still Needed Before Submission

- Final customer-facing product name: `Experimemo`
- Final iOS bundle identifier: `mrdj2u.experimemo`
- Final Android package name: `mrdj2u.experimemo`
- Final versioning for the first release:
  - marketing version: `1.0.0`
  - iOS build number: `1`
  - Android version code: `1`
- App Store listing copy:
  - subtitle: `Track experiments on the go`
  - promotional description: `Create experiment records, capture notes, attach photos, and update results from your phone without slowing down your lab workflow.`
  - keyword set: `science,experiment,lab,notes,research,data,tracker,student`
- Support URL: `https://davidjgrimsley.com/experimemo/support`
- Privacy policy URL: `https://davidjgrimsley.com/experimemo/privacy`
- Terms of service URL: `https://davidjgrimsley.com/experimemo/terms`
- Capture final screenshots after the UI copy and iconography are locked

## Review Notes For App Review

- The app helps scientists and students create, track, and update experiment
  records on mobile.
- Core record fields include title, category, hypothesis, procedure, data plan,
  results, notes, planned photo count, and attached experiment photos.
- Experiment metadata persists locally on device with Expo SQLite.
- Attached photos currently persist as local media-library URI metadata linked
  to an experiment record.
- The MVP does not require account creation, remote sync, payments, or user-to-
  user communication.

## Release Risks To Resolve Before Store Submission

- The `Settings` screen is intentionally lightweight and should only ship if its
  copy remains product-ready.
- Legal onboarding now points to the live hosted privacy policy and terms of
  service instead of placeholder in-app documents. Keep those hosted pages live
  and aligned with the shipping app behavior.
- App Store Connect credentials and the first successful TestFlight upload still
  need to be completed before `test` branch automation can succeed.
- Local-only photo URI storage is acceptable for MVP review, but it should be
  tested on a fresh install, app relaunch, and permission-denied path before
  release.

## Release Validation Checklist

- Create a new experiment and confirm required-field validation is clear.
- Save an experiment and confirm it appears immediately in `Track`.
- Reopen an experiment and edit results, notes, and planned photo count.
- Add photos from the media library, relaunch the app, and confirm the record
  still shows attached photos.
- Deny photo-library permission once and confirm the app fails gracefully.
- Test long experiment forms on iPhone and Android to confirm keyboard-aware
  scrolling keeps lower fields and save actions reachable.
- Verify light and dark mode readability on `New`, `Track`, `Settings`, and the
  experiment editor.
- Confirm there are no obvious internal-only labels such as phase references,
  placeholder copy, or scaffold routes exposed in the main flow.

## Submission Notes

- Re-run `mds doctor --ci` before any release branch or store submission work.
- Local CI currently uses `npm run build:prod` as a native release-readiness
  gate because this app does not ship a web target.
- The shipping app name and mobile bundle/package identifiers are now set in
  `app.json`.
- EAS automation files now exist:
  - `eas.json`
  - `.github/workflows/eas-testflight.yml`
  - `.github/workflows/eas-production-builds.yml`
- Keep this document as the human review checklist and pair it with the
  automated build pipeline rather than replacing it.
