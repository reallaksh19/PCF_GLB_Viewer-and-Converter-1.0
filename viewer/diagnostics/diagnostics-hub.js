/**
 * viewer/diagnostics/diagnostics-hub.js
 *
 * Minimal contract host for diagnostics tracking.
 * Plugs into the event bus to listen for system-wide diagnostic events.
 * Will be fully implemented by Agent A5.
 */
import { on } from '../core/event-bus.js';
import { RuntimeEvents } from '../contracts/runtime-events.js';

export const DiagnosticsHub = {
  snapshots: [],
  captureSnapshot: function(name, data) {
    this.snapshots.push({
      timestamp: Date.now(),
      name,
      data
    });
    // In future versions, this will trigger UI updates for diagnostic tabs.
  }
};

// Listen for global diagnostic events
on(RuntimeEvents.DIAGNOSTIC_EVENT, (payload) => {
  DiagnosticsHub.captureSnapshot(payload?.name || 'UNKNOWN', payload?.data || {});
});
