/**
 * PieChartTooltip - Custom Tooltip for Recharts
 *
 * This component is used as the `content` prop for Recharts' Tooltip component.
 * It provides a customizable tooltip display for pie chart slices.
 */

import React from 'react';
import type { PieChartDataItem, PieChartInternalData } from './types';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Type Definitions                              */
/* -------------------------------------------------------------------------- */

/**
 * Payload item type from Recharts for PieChart
 */
interface PieChartTooltipPayloadItem {
  name: string;
  value: number;
  payload: PieChartInternalData;
}

export interface PieChartTooltipProps {
  /** Whether the tooltip is currently active (hovering over a slice) */
  active?: boolean;
  /** Payload data from Recharts */
  payload?: PieChartTooltipPayloadItem[];
  /** Custom formatter function for tooltip content */
  formatter?: (item: PieChartDataItem) => React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const PieChartTooltip: React.FC<PieChartTooltipProps> = ({
  active,
  payload,
  formatter,
}) => {
  // Don't render if not active or no data
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Extract the original data item from the payload
  const data = payload[0]?.payload as PieChartInternalData | undefined;
  if (!data) {
    return null;
  }

  // Get the original item reference for the formatter
  const item = data.originalItem || data;

  // Use custom formatter if provided
  if (formatter) {
    return (
      <div className={styles.tooltip}>
        {formatter(item)}
      </div>
    );
  }

  // Default tooltip content
  return (
    <div className={styles.tooltip}>
      <div className={styles['tooltip-header']}>
        <span
          className={styles['tooltip-color']}
          style={{ backgroundColor: item.color }}
        />
        <span className={styles['tooltip-name']}>{item.name}</span>
      </div>
      <div className={styles['tooltip-value']}>
        {item.value}
        {item.unit && <span className={styles['tooltip-unit']}>{item.unit}</span>}
      </div>
    </div>
  );
};

PieChartTooltip.displayName = 'PieChartTooltip';
