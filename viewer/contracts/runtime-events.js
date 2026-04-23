export const RuntimeEvents = Object.freeze({
  TAB_CHANGED: 'tab-changed',
  FILE_LOADED: 'file-loaded',
  PARSE_COMPLETE: 'parse-complete',
  VIEWER3D_CONFIG_CHANGED: 'viewer3d-config-changed',
  DIAGNOSTIC_EVENT: 'diagnostic-event',
  NOTIFY: 'notify',
  SCOPE_CHANGED: 'scope-changed',
  LEGEND_CHANGED: 'legend-changed',
  GEO_TOGGLE: 'geo-toggle',
  LOAD_PINNED: 'load-pinned',
  MODEL_LOADED: 'model-loaded',
  COMPONENT_PICKED: 'component-picked',
  DEBUG_REFRESH: 'debug-refresh',
  SESSION_LOG: 'session-log',
  LOG_ADDED: 'log-added',
  TRACE_ADDED: 'trace-added',
  LOG_RESOLVED: 'log-resolved',
  SUPPORT_MAPPING_CHANGED: 'support-mapping-changed',
  DOCNO_CHANGED: 'docno-changed',
  FILE_DROPPED: 'file-dropped',
  JUMP_TO_OBJECT: 'jump-to-object',
  TRACE_CLEARED: 'trace-cleared',
  LOGS_CLEARED: 'logs-cleared'
});

const _validEvents = new Set(Object.values(RuntimeEvents));

export function assertRuntimeEvent(name) {
  if (!_validEvents.has(name)) {
    throw new Error(`Unregistered runtime event: ${name}`);
  }
}
