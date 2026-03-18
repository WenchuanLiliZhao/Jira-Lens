/**
 * ChartTooltip - Shared Tooltip Component for Charts
 *
 * A customizable tooltip component for use with Recharts.
 * Supports displaying series values with icons and units.
 */

import React from 'react';
import type { ChartTooltipProps } from './types';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  seriesConfig,
  formatter,
}) => {
  // Don't render if not active or no data
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      {/* Label (typically X-axis value) */}
      {label && <p className={styles.tooltipLabel}>{label}</p>}

      {/* Series values */}
      {payload.map((entry, index) => {
        const config = seriesConfig.find((s) => s.key === entry.dataKey);

        // Use custom formatter if provided
        if (formatter) {
          return (
            <div key={index} className={styles.tooltipItem}>
              {formatter(entry, config)}
            </div>
          );
        }

        // Default rendering
        return (
          <div key={index} className={styles.tooltipItem}>
            {/* Color indicator */}
            <span
              className={styles.tooltipColor}
              style={{ backgroundColor: entry.color }}
            />
            {/* Series name */}
            <span className={styles.tooltipItemLabel}>{entry.name}:</span>
            {/* Value */}
            <span className={styles.tooltipValue}>{entry.value}</span>
            {/* Unit */}
            {config?.unit && (
              <span className={styles.tooltipUnit}>{config.unit}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

ChartTooltip.displayName = 'ChartTooltip';

/* -------------------------------------------------------------------------- */
/*                           Default Export                                   */
/* -------------------------------------------------------------------------- */

export default ChartTooltip;
