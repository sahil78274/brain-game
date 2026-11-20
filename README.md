# BRAIN TRAP

An original, static notebook puzzle game. Drag cartoon objects together or off the page; tap or hold them; open **Controls & shortcuts** to rotate, resize, layer, tilt, or perform any scene action without dragging. No backend, account, or real ads are required.

## Play locally

Open the repository in VS Code and use **Open with Live Server** on `index.html`. Alternatively, run `python3 -m http.server 4173` from the repository root and open <http://localhost:4173>. Do not open it with `file://`: browsers restrict module and JSON loading there. No build or dependencies are needed to play.

For Vercel, import the repository as a static project with the root as the output directory. `vercel.json` disables framework-specific build assumptions. No keys or environment variables are required. LocalStorage is per origin and per browser; progress does not sync across devices.

## Published scope

**50 playable puzzles**, all in World 1. Ten worlds of 200 levels are planned; other worlds show no playable entries. Expansion milestones: 100 → 250 → 500 → 1,000 → 2,000. The current batch uses scene-specific action sequences, effects, layering and hidden props. Several scenes model inventions symbolically rather than simulating physics. Difficulty labels are editorial estimates, not playtest statistics.

Hints and solutions use a clearly labeled mock reward. To integrate a real provider, supply `RewardedAdService` with a provider whose async `show(kind)` resolves `true` after independently verified reward completion. A false/rejected result leaves play unaffected. The daily challenge selects a published puzzle by local date and grants a separate one-time reward.

## Author a new batch

1. Add a JSON batch under `levels/` and register the filename in `levels/manifest.json`. IDs are sequential, with world boundaries every 200 levels.
2. Add an original question, scene, difficulty, non-spoiler hint, and full walkthrough. Each piece has an ID, position, and hidden state. Add its original art to `js/art.js` or `js/props.js`.
3. Add interaction steps with action type, source ID, and a target ID for drops. A completed step can reveal another piece. For unique visual or state logic, register an optional `guard(state, action)` or `effect(state, action)` in `js/behaviors.js`.
4. Test the walkthrough, wrong moves, reset, touch usability and keyboard alternatives. Run the checks below before publishing a batch. An automated walkthrough proves reachability, not that a puzzle is intuitive or fun.

`js/engine.js` validates scene actions, `js/drag.js` maps pointer gestures, `js/scene.js` renders the SVG, `js/catalog.js` loads batches, `js/progress.js` owns saving, and `js/services.js` owns rewarded reveals and sound. The UI and optional motion input live in `js/ui.js` and `js/motion.js`.

## Verification

```sh
npm ci
npm test
npx playwright install chromium
# With Live Server or Python serving port 4173:
npm run test:browser
```

Set `TEST_URL` to test a different static URL. See [the validation report](LEVEL_VALIDATION.md) for coverage and limits.
