# Multi-Agent Upgrade Pack

# PCF / GLB Viewer Upgrade — Agent Work Pack

This pack is grounded in the current codebase snapshot from `core.zip`, especially these current seams:

- `viewer/core/*`
- `viewer/tabs/viewer3d-tab.js`
- `viewer/debug/dev-debug-window.js`
- `viewer/interchange/*`
- `viewer/tabs/model-exchange-tab.js`
- duplicate shell roots: `core/*` and `viewer/core/*`

The plan assumes the project is upgraded in **strict waves** and that contracts are frozen before parallel coding starts.


## Why this pack exists

The codebase has improved through the XML / canonical-model transition, but the transition is still incomplete. The current repo also carries overlapping runtime trees and partially duplicated module families. That makes parallel work risky unless branch scopes are explicit.

This pack converts the master upgrade plan into **agent-owned markdown files** with:

- mission and scope
- owned files and forbidden files
- technical requirements with reasoning
- critical code snippets
- pass tests and evidence artifacts
- merge rules and behavior gates

## Current repo realities that shaped the split

1. **There are two shell roots.**  
   `core/app.js` includes `Model Exchange`; `viewer/core/app.js` does not. This is a sign of split runtime ownership and must be normalized early.

2. **The XML transition is real but not complete.**  
   The new path exists under `viewer/interchange/source/xml/CaesarXmlImportAdapter.js`, `viewer/interchange/builders/xml/*`, and `viewer/interchange/canonical/*`, but active UI still mixes older direct-flow paths.

3. **The debug drawer is useful but narrow.**  
   `viewer/debug/dev-debug-window.js` is currently focused on logs, trace, support debug, event bus capture, and a small scene tab. It is not yet the full professional diagnostics surface.

4. **Some active surfaces are placeholders or only partly integrated.**  
   `viewer/tabs/model-exchange-tab.js` literally renders “Rendered Preview (data-driven placeholder)”. There are also import/export adapters and PDF/ACCDB builders with TODO markers.

5. **Production UI still uses blocking `alert()` paths.**  
   Notably inside `viewer/tabs/viewer3d-tab.js`, `viewer/tabs/config-tab.js`, and `viewer/tabs/linelist-tab.js`. These should be replaced with a unified notification + diagnostics path.

## Upgrade waves

### Wave 1 — freeze and foundation
- A1 only

### Wave 2 — safe parallel start
- A2 and A5

### Wave 3 — feature-bearing work
- A3, A4, A6, A7

### Wave 4 — hardening and release
- A8 only

## File ownership rules for high-conflict files

These files are **single-owner windows**. No concurrent edits.

| File | Owner |
|---|---|
| `viewer/tabs/viewer3d-tab.js` | A4 |
| `viewer/debug/dev-debug-window.js` | A5 |
| `viewer/core/logger.js` | A5 |
| `viewer/core/event-bus.js` | A1 |
| `viewer/core/state.js` | A1 |
| `viewer/core/app.js` and `core/app.js` | A1 |
| `viewer/interchange/state/model-exchange-actions.js` | A2 |
| `viewer/tabs/model-exchange-tab.js` | A6 |

## Contract freeze before parallelism

Before any branch beyond A1 starts coding, freeze these contracts:

- command dispatch contract
- runtime event names
- diagnostics event schema
- model exchange store patch semantics
- viewer selection / hover / fit / section command API
- notification service contract
- test fixture naming and evidence output paths

## Target folder structure

```text
viewer/
  contracts/
    runtime-events.js
    viewer-commands.js
    diagnostics-contract.js
    ui-notifications.js
  core/
    app.js
    event-bus.js
    logger.js
    state.js
  diagnostics/
    diagnostics-hub.js
    notification-center.js
    perf-trace.js
    diagnostics-export.js
  interchange/
    source/
    builders/
    canonical/
    export/
    validation/
    state/
    docs/
  viewer3d/
    runtime/
    commands/
    panels/
    tools/
    adapters/
  tabs/
    viewer3d-tab.js
    model-exchange-tab.js
    logs-tab.js
    debug-tab.js
  tests/
    fixtures/
    contract/
    unit/
    integration/
    e2e/
```

## Global merge controls from lessons learned

1. Freeze contracts first, then parallelize.
2. Enforce file ownership on the high-conflict files above.
3. Never resolve conflict-heavy runtime files using blanket `--ours` or `--theirs`.
4. Merge in waves only.
5. Require behavior gates, not only compile gates.
6. Add contract-violation static checks.
7. Block silent regressions with pre-merge critical-marker scans.
8. Keep stubs and placeholders out of routed production UI.
9. Require pass logs and smoke evidence from every agent branch.
10. Run one final behavior-parity audit before merge to main.

## Included agent files

- `A1_Foundation_Contracts_and_Runtime.md`
- `A2_Interchange_XML_and_Canonical_Model.md`
- `A3_Export_RoundTrip_and_Loss_Contracts.md`
- `A4_Viewer3D_Runtime_and_Tool_Behavior.md`
- `A5_Debugging_Logging_and_Diagnostics.md`
- `A6_UI_Surfaces_Model_Exchange_and_Polish.md`
- `A7_Data_Calcs_Reports_and_Benchmarking.md`
- `A8_QA_Integration_Release_and_Parity_Audit.md`

## Required evidence artifact layout per branch

```text
artifacts/
  <agent-id>/
    pass/
      unit.txt
      contract.txt
      integration.txt
      e2e.txt
    screenshots/
    diagnostics/
      diag-export.json
      trace-summary.json
    reports/
      feature-matrix.md
      parity-checklist.md
```

## Definition of done for every agent

A branch is not merge-ready unless it contains:

- code
- tests
- pass logs
- smoke evidence
- updated markdown notes
- explicit list of touched files
- explicit list of untouched high-conflict files
