# A5 — Debugging, Logging, Diagnostics, Debug-Collapsible Window

## Mission

Upgrade the existing debug-collapsible window into a robust diagnostics cockpit that supports development, QA, and user-support triage.

## Owned files

- `viewer/debug/dev-debug-window.js`
- `viewer/debug/support-debug.js`
- `viewer/core/logger.js`
- `viewer/tabs/logs-tab.js`
- `viewer/tabs/log-panel.js`
- `viewer/diagnostics/*` (new)
- `viewer/tests/integration/diagnostics/*`

## Forbidden files

- `viewer/tabs/viewer3d-tab.js`
- `viewer/interchange/state/model-exchange-actions.js`
- shell files owned by A1

## Current source observations

Good:
- `viewer/debug/dev-debug-window.js` already aggregates logs, traces, support debug, and event-bus events.
- `viewer/tabs/log-panel.js` already supports filtering, detail panes, and export affordances.
- `viewer/core/logger.js` already separates logs and trace events.

Weak:
- diagnostics are fragmented
- the debug drawer is localhost-only and too narrow in scope
- logging has no formal schema codes
- there is no unified notification and no proper diagnostic export bundle

## Main deliverables

1. Central diagnostics hub.
2. Unified notification center replacing `alert()`.
3. Debug drawer tabs for:
   - logs
   - trace
   - supports
   - imports
   - exports
   - performance
   - active selection/runtime state
4. Export diagnostics bundle.
5. Stable diagnostic event schema.

## Technical requirements

### 1) Diagnostics hub
Reasoning: logs, traces, support debug, and UI notifications should not each invent different payload shapes.

### 2) Debug window upgrade
Reasoning: the existing drawer is a strong seed. Keep the collapsible pattern, but make it whole-app.

### 3) Notification center
Reasoning: `alert()` is disruptive, non-exportable, and non-professional.

### 4) Diagnostic codes
Reasoning: free-text logs are useful, but machine-readable codes are what QA and support need.

## Critical code snippets

### Snippet A — diagnostics hub

```js
// viewer/diagnostics/diagnostics-hub.js
import { addLog, addTraceEvent } from '../core/logger.js';
import { emit } from '../core/event-bus.js';
import { RuntimeEvents } from '../contracts/runtime-events.js';

export function publishDiagnostic(entry) {
  if (entry.kind === 'trace') {
    addTraceEvent(entry);
  } else {
    addLog(entry);
  }
  emit(RuntimeEvents.DIAGNOSTIC_EVENT, entry);
}
```

### Snippet B — notification center

```js
// viewer/diagnostics/notification-center.js
const notifications = [];

export function notify({ level = 'info', title = '', message = '', details = null }) {
  const item = {
    id: crypto.randomUUID(),
    ts: Date.now(),
    level,
    title,
    message,
    details,
  };
  notifications.push(item);
  publishDiagnostic({
    severity: level,
    category: 'ui',
    message: `${title}: ${message}`.trim(),
    code: 'UI_NOTIFICATION',
    payload: details,
  });
  return item;
}
```

### Snippet C — debug drawer extra tabs

```js
const TABS = ['logs', 'trace', 'supports', 'imports', 'exports', 'perf', 'scene'];

function _renderImportsTab() {
  return `<pre>${_esc(JSON.stringify(getImportDiagnostics(), null, 2))}</pre>`;
}
```

### Snippet D — diagnostics bundle export

```js
export function exportDiagnosticsBundle() {
  return {
    exportedAt: new Date().toISOString(),
    logs,
    traceEvents,
    supportDebug: getSupportDebugState(),
    perf: getPerfTraceState(),
    notifications,
  };
}
```

## Work breakdown

1. Add diagnostics hub and schema.
2. Replace raw log/trace islands with hub publishing.
3. Add notification center.
4. Expand debug drawer tabs.
5. Add diagnostics bundle export.
6. Add tests.

## Pass tests

### Integration
- a viewer import failure appears as:
  - notification
  - diagnostic log
  - exportable bundle entry
- support-debug events are visible in drawer
- drawer summary counts update live
- logs tab and bottom log panel stay consistent

### Quantitative thresholds
- zero new raw `console.*` diagnostics for normal user-facing failures
- 100% of user-facing failure messages route through notification center
- diagnostics export bundle contains logs, traces, notifications, and support debug

## Evidence required

- `artifacts/A5/pass/integration.txt`
- `artifacts/A5/diagnostics/diag-export.json`
- `artifacts/A5/screenshots/debug-collapsible-window.png`
- `artifacts/A5/reports/diagnostic-code-catalog.md`

## Merge gate

A5 may not rewrite viewer behavior. It merges only after A1 contracts are honored and drawer behavior is fully tested.
