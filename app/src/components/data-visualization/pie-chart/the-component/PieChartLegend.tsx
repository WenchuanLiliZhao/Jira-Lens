/**
 * PieChartLegend - Legend Component for PieChart
 *
 * Displays a legend for the pie chart with optional icons, values, and units.
 * Supports both bottom and right positioning with appropriate layouts.
 */

import React from 'react';
import clsx from 'clsx';
import { Icon } from '../../../general/icon';
import type { PieChartDataItem } from './types';
import { DEFAULT_DESIGN } from './constants';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Type Definitions                              */
/* -------------------------------------------------------------------------- */

export interface PieChartLegendProps {
  /** Data items to display in the legend */
  data: PieChartDataItem[];
  /** Position of the legend */
  position: 'bottom' | 'right';
  /** Width of the legend container (only for right position) */
  width?: number;
  /** Whether to show numeric values */
  showValue?: boolean;
  /** Whether to show units */
  showUnit?: boolean;
  /** Custom class name */
  className?: string;
}

export interface LegendItemProps {
  /** The data item to render */
  item: PieChartDataItem;
  /** Whether to show numeric value */
  showValue: boolean;
  /** Whether to show unit */
  showUnit: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           Legend Item Component                            */
/* -------------------------------------------------------------------------- */

const LegendItem: React.FC<LegendItemProps> = ({
  item,
  showValue,
  showUnit,
}) => {
  // Use legendValue if provided, otherwise fall back to value
  const displayValue = item.legendValue ?? item.value;
  // Use legendUnit if provided, otherwise fall back to unit
  const displayUnit = item.legendUnit ?? item.unit ?? '';

  return (
    <div className={styles['legend-item']}>
      {/* Icon or color indicator */}
      {item.icon ? (
        <span className={styles['legend-icon']} style={{ color: item.color }}>
          <Icon icon={item.icon} />
        </span>
      ) : (
        <span
          className={styles['legend-color']}
          style={{ backgroundColor: item.color }}
        />
      )}

      {/* Name and optional value */}
      <span className={styles['legend-text']}>
        {item.name}
        {showValue && (
          <span className={styles['legend-count']}>
            {' '}({displayValue}{showUnit && displayUnit})
          </span>
        )}
      </span>
    </div>
  );
};

LegendItem.displayName = 'LegendItem';

/* -------------------------------------------------------------------------- */
/*                           Legend Container Component                       */
/* -------------------------------------------------------------------------- */

export const PieChartLegend: React.FC<PieChartLegendProps> = ({
  data,
  position,
  width,
  showValue = false,
  showUnit = false,
  className,
}) => {
  const isRight = position === 'right';

  return (
    <div
      className={clsx(
        styles['legend-container'],
        isRight && styles['legend-container--right'],
        className
      )}
      style={{
        ...(isRight && width ? { width } : {}),
      }}
    >
      <div
        className={clsx(
          styles['legend-items'],
          isRight && styles['legend-items--right']
        )}
        style={{
          columnGap: DEFAULT_DESIGN.legendGapX,
          rowGap: DEFAULT_DESIGN.legendGapY,
        }}
      >
        {data.map((item) => (
          <LegendItem
            key={item.id}
            item={item}
            showValue={showValue}
            showUnit={showUnit}
          />
        ))}
      </div>
    </div>
  );
};

PieChartLegend.displayName = 'PieChartLegend';
