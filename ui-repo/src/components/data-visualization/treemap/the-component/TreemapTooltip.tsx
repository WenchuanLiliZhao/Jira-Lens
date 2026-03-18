/**
 * TreemapTooltip - Custom Tooltip Component
 *
 * Displays detailed information about a hovered treemap node.
 * Uses shared chart tooltip styles from _chart-shared for consistency.
 * Supports custom formatting via the formatter prop.
 */

import React from 'react';
import type { TreemapDataItem } from './types';
import styles from '../../_chart-shared/styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Types                                         */
/* -------------------------------------------------------------------------- */

interface TooltipPayloadItem {
  payload: TreemapDataItem & {
    value: number;
    name: string;
    color?: string;
  };
}

export interface TreemapTooltipProps {
  /** Whether the tooltip is active */
  active?: boolean;
  /** Tooltip payload from Recharts */
  payload?: TooltipPayloadItem[];
  /** Custom formatter for tooltip content */
  formatter?: (item: TreemapDataItem) => React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const TreemapTooltip: React.FC<TreemapTooltipProps> = ({
  active,
  payload,
  formatter,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]?.payload;
  if (!data) {
    return null;
  }

  // Use custom formatter if provided
  if (formatter) {
    return (
      <div className={styles.tooltip}>
        {formatter(data)}
      </div>
    );
  }

  // Format value with unit based on position
  const formatValueWithUnit = () => {
    if (data.value === undefined) return null;
    const formattedValue = typeof data.value === 'number' 
      ? data.value.toLocaleString() 
      : data.value;
    
    if (!data.unit) return formattedValue;
    
    const unitPosition = data.unitPosition || 'after';
    if (unitPosition === 'before') {
      return (
        <>
          <span className={styles.tooltipUnit}>{data.unit}</span>
          {formattedValue}
        </>
      );
    }
    return (
      <>
        {formattedValue}
        <span className={styles.tooltipUnit}>{data.unit}</span>
      </>
    );
  };

  // Default tooltip content - using shared chart tooltip styles
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipItem}>
        {data.color && (
          <span
            className={styles.tooltipColor}
            style={{ backgroundColor: data.color }}
          />
        )}
        <span className={styles.tooltipItemLabel}>{data.name}:</span>
        {data.value !== undefined && (
          <span className={styles.tooltipValue}>
            {formatValueWithUnit()}
          </span>
        )}
      </div>
    </div>
  );
};

TreemapTooltip.displayName = 'TreemapTooltip';
