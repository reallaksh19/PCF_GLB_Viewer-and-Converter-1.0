/**
 * viewer/contracts/viewer-commands.js
 * Commands bound strictly to the UI/Viewer orchestration interactions.
 */

export const ViewerCommand = Object.freeze({
  FIT_ALL: 'FIT_ALL',
  FIT_SELECTION: 'FIT_SELECTION',
  TOGGLE_SECTION: 'TOGGLE_SECTION',
  TOGGLE_MEASURE: 'TOGGLE_MEASURE',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  TOGGLE_MARQUEE_ZOOM: 'TOGGLE_MARQUEE_ZOOM',
  TOGGLE_PROJECTION: 'TOGGLE_PROJECTION',
});

export function dispatchViewerCommand(ctx, cmd) {
  if (!ctx || !ctx.viewer) {
    console.warn('[dispatchViewerCommand] No viewer context available.', cmd);
    return;
  }

  switch (cmd.type) {
    case ViewerCommand.FIT_ALL:
      return ctx.viewer.fitAll?.();
    case ViewerCommand.FIT_SELECTION:
      return ctx.viewer.fitSelection?.();
    case ViewerCommand.TOGGLE_SECTION:
      return ctx.viewer.toggleSectionMode?.();
    case ViewerCommand.TOGGLE_MEASURE:
      return ctx.viewer.toggleMeasureMode?.();
    case ViewerCommand.SET_VIEW_MODE:
      return ctx.viewer.setView?.(cmd.payload?.mode);
    case ViewerCommand.CLEAR_SELECTION:
      return ctx.viewer.clearSelection?.();
    case ViewerCommand.TOGGLE_MARQUEE_ZOOM:
      return ctx.viewer.toggleMarqueeZoom?.();
    case ViewerCommand.TOGGLE_PROJECTION:
      return ctx.viewer.toggleProjection?.();
    default:
      throw new Error(`Unsupported viewer command: ${cmd.type}`);
  }
}
