# experimemo Style

## Visual Direction

- The app should feel like a calm lab notebook: precise, clean, and dependable rather than playful or flashy.
- Favor quick capture and fast review over decorative UI. Scientists should feel like the app helps them stay focused on the experiment, not on the software.

## Brand/References

- Visual references: field notebooks, clipped lab sheets, specimen cards, and camera-assisted note capture.
- The product tone should feel practical and trustworthy, with subtle polish instead of startup-style gloss.

## Colors

- Canonical editable tokens live in `project/theme.json`.
- Run `mds stylist sync .` if theme tokens change and this file needs to be refreshed.
- Keep the current green primary as the "record progress / continue" color.
- Use a burnt orange secondary for completed states and secondary actions.
- Use neutral slate backgrounds and surfaces so captured photos, notes, and measurements remain the focus.
- Dark mode should stay functional and low-glare, not neon or high-saturation.

## Typography

- System fonts are acceptable for MVP speed.
- Headings should feel strong and clear; body copy should stay readable during long note-taking sessions.
- Measurement values, timestamps, and IDs can use mono treatment later where clarity matters more than personality.

## Layout/Spacing

- Prefer roomy cards, obvious section dividers, and strong scanability for experiment details.
- Optimize for one-hand use on phones with large tap targets and clear save/continue actions.
- Rounded corners and spacing should feel modern but restrained, more tool-like than social.

## Motion Tone

- Motion should be quick, quiet, and informative.
- Use small confirmation and transition cues that reinforce progress without distracting from data entry.

## Accessibility Notes

- Prefer readable contrast, scalable type, clear focus/pressed states, and platform-appropriate interactions.
- Add user-specific accessibility needs here when known.

## Style Questions To Revisit

- Decide how photo attachments should be previewed in dense experiment lists.
- Revisit whether folders/categories should feel more like tags, notebook sections, or project drawers.

<!-- MDS_STYLIST_THEME_START -->

## Canonical Theme Tokens (Managed by Stylist)

The block below mirrors `project/theme.json` and is managed by `mds stylist sync`.

```json
{
  "version": 1,
  "colorSystem": {
    "mode": "bg",
    "previewScheme": "light",
    "familyMode": "one"
  },
  "families": {
    "light": {
      "primary": "blue",
      "secondary": "orange",
      "success": "emerald",
      "warning": "amber"
    },
    "dark": {
      "primary": "blue",
      "secondary": "orange",
      "success": "emerald",
      "warning": "amber"
    }
  },
  "palettes": {
    "bg": {
      "light": {
        "background": "#f8fafc",
        "surface": "#e2e8f0",
        "text": "#111827",
        "primary": "#299a0f",
        "secondary": "#b85d13",
        "success": "#16a34a",
        "warning": "#f97316"
      },
      "dark": {
        "background": "#09090b",
        "surface": "#18181b",
        "text": "#f8fafc",
        "primary": "#299a0f",
        "secondary": "#d48a45",
        "success": "#4ade80",
        "warning": "#fb923c"
      }
    },
    "automatic": {
      "light": {
        "background": "#f5f9ff",
        "surface": "#e7f0fe",
        "text": "#132a4f",
        "primary": "#3b82f6",
        "secondary": "#b85d13",
        "success": "#10b981",
        "warning": "#f59e0b"
      },
      "dark": {
        "background": "#132132",
        "surface": "#1f3550",
        "text": "#d6e8fe",
        "primary": "#60a5fa",
        "secondary": "#d48a45",
        "success": "#34d399",
        "warning": "#fbbf24"
      }
    }
  },
  "colors": {
    "light": {
      "background": "#f8fafc",
      "surface": "#e2e8f0",
      "text": "#111827",
      "primary": "#299a0f",
      "secondary": "#b85d13",
      "success": "#16a34a",
      "warning": "#f97316"
    },
    "dark": {
      "background": "#09090b",
      "surface": "#18181b",
      "text": "#f8fafc",
      "primary": "#299a0f",
      "secondary": "#d48a45",
      "success": "#4ade80",
      "warning": "#fb923c"
    }
  },
  "typography": {
    "fontFamily": "System",
    "fontDisplay": "System",
    "fontTitle": "System",
    "fontSubtitle": "System",
    "fontBody": "System",
    "fontCaption": "System",
    "fontMono": "monospace",
    "displaySize": 32,
    "headingSize": 20,
    "bodySize": 15,
    "captionSize": 12
  },
  "layout": {
    "radius": 12,
    "spacing": {
      "xs": 4,
      "sm": 8,
      "md": 16,
      "lg": 24,
      "xl": 32
    }
  }
}
```

<!-- MDS_STYLIST_THEME_END -->
