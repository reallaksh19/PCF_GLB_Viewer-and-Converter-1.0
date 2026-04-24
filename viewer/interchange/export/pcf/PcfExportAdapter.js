import { FidelityClass } from '../../canonical/FidelityClass.js';
import { buildLossContract } from '../../validation/LossContractEvaluator.js';
import { buildExportResult } from '../common/export-result.js';

export class PcfExportAdapter {
  export(project) {
    const losses = [];
    const lines = [];
    for (const seg of project.segments || []) {
      lines.push(`PIPE`);
      lines.push(`    FROM-NODE ${seg.fromNodeId || '0'}`);
      lines.push(`    TO-NODE ${seg.toNodeId || '0'}`);

      const lossContract = buildLossContract({
        objectId: seg.id,
        sourceFormat: project.metadata?.format || 'UNKNOWN',
        targetFormat: 'PCF',
        fidelityClass: seg.fidelity || FidelityClass.RECONSTRUCTED,
        rawPreserved: !!Object.keys(seg.rawAttributes || {}).length,
        normalizedPreserved: true,
      });
      losses.push({
        code: 'PCF_EXPORT_LOSS',
        severity: lossContract.fidelityClass === FidelityClass.RECONSTRUCTED ? 'warning' : 'info',
        sourceObjectId: seg.id,
        sourceKind: 'segment',
        targetFormat: 'PCF',
        preserved: ['topology', 'nominalSize'],
        dropped: lossContract.droppedFields || ['customMetadata']
      });
    }
    return buildExportResult({
      text: lines.join('\n'),
      losses,
      meta: {
        producer: 'PcfExportAdapter',
        sourceFormat: project.metadata?.format || 'UNKNOWN',
        targetFormat: 'PCF'
      }
    });
  }
}
