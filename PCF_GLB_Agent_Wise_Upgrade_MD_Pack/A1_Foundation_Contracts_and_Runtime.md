# A1 — Foundation, Contracts, Runtime Unification

## Mission

Create the stable base that all other agents depend on. This agent is the only one allowed to touch the app shell, global state/event contracts, and duplicate-root runtime normalization.

## Why this is first

The repo currently has a split shell:

- `core/app.js`
- `viewer/core/app.js`

Those two files are already drifting in behavior. One includes `Model Exchange`, the other does not. If multiple agents work before this is normalized, branch merges will overwrite behavior.

## Owned files

- `core/app.js`
- `viewer/core/app.js`
- `viewer/core/state.js`
- `viewer/core/event-bus.js`
- `viewer/contracts/*` (new)
- `viewer/diagnostics/diagnostics-hub.js` (new contract host only)
- `viewer/tests/contract/*` (new)

## Forbidden files

- `viewer/tabs/viewer3d-tab.js`
- `viewer/debug/dev-debug-window.js`
- `viewer/interchange/state/model-exchange-actions.js`
- `viewer/tabs/model-exchange-tab.js`

## Main deliverables

1. Pick a single shipping shell.
2. Quarantine the non-shipping shell.
3. Freeze runtime event names and command entry points.
4. Freeze state mutation seams.
5. Add contract tests and static scans.

## Technical requirements

### 1) Single runtime shell
Reasoning: today the repo contains two app shells with similar responsibilities and divergent tabs. That is a merge hazard and a product hazard.

Decision:
- keep `viewer/core/app.js` as the shipping shell
- convert `core/app.js` into either:
  - a thin compatibility wrapper, or
  - a quarantined legacy entry marked non-shipping

### 2) Event contract registry
Reasoning: the current event bus accepts any string. That is fast, but it allows silent divergence.

Current file:
- `viewer/core/event-bus.js`

Required outcome:
- add `viewer/contracts/runtime-events.js`
- all emits/on/off must use exported constants

### 3) Command dispatcher contract
Reasoning: UI buttons should not directly mutate deep runtime objects or invent new action strings.

Required outcome:
- add `viewer/contracts/viewer-commands.js`
- central dispatcher sits between UI and runtime

### 4) State patch discipline
Reasoning: `viewer/core/state.js` is a large singleton. It is practical, but it needs protected write seams now that multiple agents will work in parallel.

Required outcome:
- freeze official mutation helpers for:
  - active tab
  - imported source metadata
  - viewer3D config
  - diagnostics snapshots
  - model exchange selection

### 5) Contract-violation checks
Reasoning: compile passing is not enough. Branches must fail if they bypass the dispatcher or emit unregistered event names.

## Critical code snippets

### Snippet A — runtime event registry

```js
// viewer/contracts/runtime-events.js
export const RuntimeEvents = Object.freeze({
  TAB_CHANGED: 'tab-changed',
  FILE_LOADED: 'file-loaded',
  PARSE_COMPLETE: 'parse-complete',
  VIEWER3D_CONFIG_CHANGED: 'viewer3d-config-changed',
  DIAGNOSTIC_EVENT: 'diagnostic-event',
  NOTIFY: 'notify',
});

export function assertRuntimeEvent(name) {
  if (!Object.values(RuntimeEvents).includes(name)) {
    throw new Error(`Unregistered runtime event: ${name}`);
  }
}
```

### Snippet B — hardened event bus

```js
// viewer/core/event-bus.js
import { assertRuntimeEvent } from '../contracts/runtime-events.js';

const listeners = new Map();

export function on(event, fn) {
  assertRuntimeEvent(event);
  const list = listeners.get(event) || [];
  list.push(fn);
  listeners.set(event, list);
}

export function emit(event, payload) {
  assertRuntimeEvent(event);
  for (const fn of listeners.get(event) || []) fn(payload);
}
```

### Snippet C — command dispatcher contract

```js
// viewer/contracts/viewer-commands.js
export const ViewerCommand = Object.freeze({
  FIT_ALL: 'FIT_ALL',
  FIT_SELECTION: 'FIT_SELECTION',
  TOGGLE_SECTION: 'TOGGLE_SECTION',
  TOGGLE_MEASURE: 'TOGGLE_MEASURE',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
});

export function dispatchViewerCommand(ctx, cmd) {
  switch (cmd.type) {
    case ViewerCommand.FIT_ALL:
      return ctx.viewer?.fitAll?.();
    case ViewerCommand.FIT_SELECTION:
      return ctx.viewer?.fitSelection?.();
    default:
      throw new Error(`Unsupported viewer command: ${cmd.type}`);
  }
}
```

### Snippet D — quarantine duplicate shell

```js
// core/app.js
export { init } from '../viewer/core/app.js';
console.warn('[compat] core/app.js is a compatibility entry. Shipping entry is viewer/core/app.js');
```

## Work breakdown

1. Inventory both shell roots and all entry HTML/JS links.
2. Decide shipping entry.
3. Add contracts directory.
4. Refactor event bus and command dispatch to use contracts.
5. Add state mutation helpers.
6. Add static scans.
7. Add contract tests.

## Pass tests

### Contract tests
- all event names used at runtime are exported from `viewer/contracts/runtime-events.js`
- no direct string event emission outside contract files
- no UI module directly calls deep runtime operations that are supposed to go through dispatcher

### Static checks
- fail if branch introduces new `emit('literal')` not defined in contract registry
- fail if branch writes to forbidden global state paths directly

### Smoke tests
- app boots through the chosen single shell
- tab switching still works
- no missing tab due to entry drift
- no console errors from quarantined legacy shell

## Evidence required

- `artifacts/A1/pass/contract.txt`
- `artifacts/A1/reports/runtime-entry-map.md`
- `artifacts/A1/reports/frozen-contracts.md`

## Merge gate

A1 must be merged before any other agent branch is allowed to leave draft status.
