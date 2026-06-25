# experimemo Project Info

## App Name
experimemo

## Overview

Build an Expo app for Scientists and people learning how to conduct experiments. Deliver a top class simple app that aids in experimentation without slowing work down.

## Target Users

Scientists and people learning how to conduct experiments

## Problem this app solves
There's no good way to track experiment data on the go.

## Product Goals

Provide a way for other scientists and I to track and manage our experiments effectively.

## Non-Goals

Ways to actually conduct experiments, analyze data, or collaborate with other scientists.

## First User Flow

Create an experiment

## Core Flows and Features

Create an experiment
Track multiple experiments, each with its own hypothesis, procedure, data collection, and results.
View and edit existing experiments
Add pictures and notes to experiments
Organize experiments into folders or categories
Search and filter experiments

## Screens

New (create new experiment)
Track (list of past experiments)
App info modal

## Platforms

- Target platforms: ios, android
- First MVP platform: ios

## Monetization Strategy

Will consider applying for grants to fund development and maintenance, but no monetization planned for the MVP.

## Team Context

Solo dev & designer for logos

## Later Scope & Possibilities

Voice notes transcribed into text for hands free documenting. Tripod support. Multiple device data sync.

## Research, Notes, and References

- Source project: f:\SoftwareDev\mrdj-dev-suite\test-apps\experimental3
There are a lot of science students wanting to conduct experiments.

## Imported Notes

The following notes existed before MDS normalized this file. An agent should move useful details into the correct sections during project intake.

```md
# Experiment-Tracker Project Info

## App Name
experimemo

## Overview

Build an Expo app for Scientists and people learning how to conduct experiments. Deliver a top class simple app that aids in experimentation without slowing work down.

## Target Users

Scientists and people learning how to conduct experiments

## Problem this app solves
There's no good way to track experiment data on the go.

## Product Goals

Provide a way for other scientists and I to track and manage our experiments effectively.

## Non-Goals

Ways to actually conduct experiments, analyze data, or collaborate with other scientists.

## First User Flow

- Create an experiment

## Core Flows and Features

- Track multiple experiments, each with its own hypothesis, procedure, data collection, and results.
- View and edit existing experiments
- Add pictures and notes to experiments
- Organize experiments into folders or categories
- Search and filter experiments

## Screens
- New (create new experiment)
- Track (list of past experiments)
- Settings

## Platforms

- Target platforms: ios, android
- First MVP platform: ios

## Monetization Strategy

Will consider applying for grants to fund development and maintenance, but no monetization planned for the MVP.

## Team Context

Solo dev

## Later Scope & Possibilities
Voice notes transcribed into text for hands free documenting. Tripod support. Multiple device data sync.

## Research, Notes, and References
There are a lot of science students wanting to conduct experiments.

# Tech Stack & CESS Onboarding

- TypeScript: Yes
- Package Manager: npm
- Navigation: Expo Router
- Type of Navigation: Native tabs + modal stack
- Expo Router app directory: `src/app`
- Platform-specific organization (folders, files, or inline): platform-specific files only
- Platform layout mode: shared layouts
- Web output: none

- Style Library: NativeWindUI
- Which NativeWindUI components: All
- Components from create-expo-app: Yes
- Expo UI: yes
- Expo UI Universal components: yes
- Expo Native Tabs: yes

- Which Software Mansion packages: All
- State management library: None
- Auth: None
- Data Categories: Local UI/app state, image uploads
- Starting Data mode: local dummy data with Expo SQLite.

- Internationalization: None
- Analytics: None
- EAS: Yes
- EAS Usage: Building mobile apps
- Deployed server: no deployed server planned
- Initial Deployment plan: App Store

- Start with MDS project guidelines template: Yes
- Use test-to-main safeguards: Yes
```


# Tech Stack & CESS Onboarding

- TypeScript: Yes
- Package Manager: npm
- Navigation: Expo Router
- Type of Navigation: Drawer + Tabs
- Expo Router app directory: `src/app`
- Platform-specific organization: platform-specific files only
- Platform layout mode: shared layouts
- Web output: none

- Style Library: NativeWindUI
- Which NativeWindUI components: All
- Components from create-expo-app: Yes
- Expo UI: Yes
- Expo UI Universal components: Yes
- Expo Native Tabs: Yes

- Which Software Mansion packages: All
- State management library: None
- Auth: None
- Data Categories: - Local UI/app state
- File/image uploads or storage
- Starting Data mode: local dummy data with Expo SQLite.

- Internationalization: None
- Analytics: None
- EAS: Yes
- EAS Usage: building mobile applications
- Deployed server: no deployed server planned
- Initial Deployment plan: App Store

- Start with MDS project guidelines template: Yes
- Use test-to-main safeguards: Yes
