# Brain Trap — first-batch validation

**Result: 50 playable levels published and all 50 solution paths verified.** This report does not certify unbuilt levels or subjective difficulty.

| Check | Result |
| --- | --- |
| Catalog, per-level validation, saves and reward failure handling (`npm test`) | 53/53 passing |
| Browser solutions, in campaign order | 50/50 completed in Chromium |
| Direct gestures | Off-scene pointer drag (level 1), tap (level 3), and hold (level 4) |
| Other scene actions | Tested via the accessible controls, which share the same validator as gestures |
| Browser progression | 500 campaign coins, every published level unlocked, completion restored after reload |
| Daily rewards and settings | Daily completion, 25-coin reward, sound toggle, confirmed progress reset |
| Rewarded hint | Explicit mock flow and reveal persistence verified in browser |
| Desktop/mobile | 1440×900 desktop and 390×844 touch-emulated viewport; mobile solve, no horizontal document overflow |
| Console | No console errors or uncaught exceptions in the tested routes |

The data checks reject gaps and duplicate IDs, missing text and artwork, broken action references, and impossible ordered walkthroughs. They also reject invalid moves and confirm reset produces a new scene. The browser suite exercises actual widgets and unlocks levels through the UI, not by injecting saved progress.

## Stage notes

- **Core and UI:** Added `index.html`, `style.css`, SVG branding, and `js/ui.js`. Verified the gameplay route on a static server.
- **Interactions and content:** Added the engine, pointer and SVG modules, optional behavior and motion hooks, JSON manifest, and the initial batch. Enlarged SVG hit areas after a direct-gesture test exposed a missed interaction.
- **Progress and rewards:** Added LocalStorage saves, campaign and daily rewards, world selection, audio and mock ad integration. Verified reload and reset.
- **Responsive and delivery:** Added mobile viewBox framing, Live Server instructions and Vercel configuration. Ran Chromium via the npm-distributed binary in this environment because the default Playwright download host was inaccessible.

## Before the next release

- Playtest on physical devices, especially sensor permission and tilt input, and calibrate difficulty ratings from observed solve times. The manual tilt alternative is already covered in the campaign walkthrough.
- Add more state-based and physics puzzles instead of relying on ordered actions for most new scenes. The current difficulty labels are estimates, not a verified match to the long-term distribution target.
- Author and validate the next batch toward 100 levels. There are no executable placeholders for the remaining 1,950 roadmap entries.
- Vercel configuration is prepared; a hosted production deployment has not been run here.
