/**
 * PieChart Component - Main Implementation
 *
 * A customizable donut/pie chart component built on Recharts.
 *
 * Features:
 * - Configurable size (sm/md/lg or custom pixels)
 * - Legend positioning (bottom/right/none)
 * - Custom labels with hover/always/none display modes
 * - Tooltip support with custom formatters
 * - Icon support in legend items
 * - Color scheme support
 *
 * @example
 * ```tsx
 * <PieChart
 *   data={[
 *     { id: '1', name: 'Category A', value: 45, color: '#3B82F6' },
 *     { id: '2', name: 'Category B', value: 30, color: '#10B981' },
 *     { id: '3', name: 'Category C', value: 25, color: '#F59E0B' },
 *   ]}
 *   size="md"
 *   legendPosition="bottom"
 *   showTooltip
 * />
 * ```
 */

import React from 'react';
import clsx from 'clsx';
import type { PieChartProps } from './types';
import { DEFAULT_DESIGN, PIE_CHART_SIZES } from './constants';
import { PieChartContent } from './ComponentContent';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (props, ref) => {
    const {
      // Data
      data,
      // Size
      size = PIE_CHART_SIZES.md,
      ringWidth = DEFAULT_DESIGN.ringWidth,
      // Legend
      legendPosition = 'bottom',
      legendWidth = DEFAULT_DESIGN.legendWidth,
      showLegendValue = false,
      showLegendUnit = false,
      // Label
      labelDisplay = 'none',
      showLabelUnit = true,
      // Tooltip
      showTooltip = true,
      tooltipFormatter,
      // Colors
      colorScheme,
      // Interactions
      onSliceClick,
      onSliceHover,
      // Spacing
      spacing = DEFAULT_DESIGN.spacing,
      // DOM
      className,
      ...restProps
    } = props;

    // Build className
    const containerClassName = clsx(
      styles.container,
      legendPosition === 'right' && styles['container--right'],
      className
    );

    // Handle empty data
    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={clsx(styles.container, styles['container--empty'], className)}
          {...restProps}
        >
          <div className={styles['empty-message']}>No data available</div>
        </div>
      );
    }

    return (
      <div ref={ref} className={containerClassName} {...restProps}>
        <PieChartContent
          data={data}
          size={size}
          ringWidth={ringWidth}
          legendPosition={legendPosition}
          legendWidth={legendWidth}
          showLegendValue={showLegendValue}
          showLegendUnit={showLegendUnit}
          labelDisplay={labelDisplay}
          showLabelUnit={showLabelUnit}
          showTooltip={showTooltip}
          tooltipFormatter={tooltipFormatter}
          colorScheme={colorScheme}
          onSliceClick={onSliceClick}
          onSliceHover={onSliceHover}
          spacing={spacing}
        />
      </div>
    );
  }
);

PieChart.displayName = 'PieChart';
