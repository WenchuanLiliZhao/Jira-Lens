/**
 * ComboChart Component - Main Implementation
 *
 * A flexible dual-axis combination chart component built on Recharts.
 * Supports both column (bar) and line visualizations on independent Y-axes.
 *
 * Features:
 * - Dual Y-axes (left and right) with independent configuration
 * - Mixed visualization types (column + line)
 * - Line display modes: line, line-area, area
 * - Single or dual axis support
 * - Custom Y-axis domains and ticks
 *
 * @example
 * ```tsx
 * <ComboChart
 *   data={[
 *     { label: 'Q1', sales: 100, growth: 10 },
 *     { label: 'Q2', sales: 150, growth: 15 },
 *   ]}
 *   series={[
 *     { key: 'sales', type: 'column', title: 'Sales', yAxisId: 'left' },
 *     { key: 'growth', type: 'line', title: 'Growth %', yAxisId: 'right' },
 *   ]}
 *   leftYAxis={{ label: 'Sales' }}
 *   rightYAxis={{ label: 'Growth %' }}
 * />
 * ```
 */

import React from 'react';
import clsx from 'clsx';
import type { ComboChartProps } from './types';
import { sharedChartStyles } from '../../_chart-shared';
import { ComboChartContent } from './ComponentContent';

// Use shared chart styles
const styles = sharedChartStyles;

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const ComboChart = React.forwardRef<HTMLDivElement, ComboChartProps>(
  (props, ref) => {
    const {
      // Data
      data,
      series,
      // Y-Axes
      leftYAxis,
      rightYAxis,
      // Legend
      showLegend = true,
      legendPosition = 'bottom',
      // Grid
      grid = true,
      // Spacing
      chartMargin,
      xAxisPadding,
      // DOM
      className,
      ...restProps
    } = props;

    // Build className
    const containerClassName = clsx(styles.chartContainer, className);

    // Handle empty data
    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={clsx(styles.chartContainer, styles['chartContainer--empty'], className)}
          {...restProps}
        >
          <div className={styles.emptyMessage}>No data available</div>
        </div>
      );
    }

    // Handle empty series
    if (!series || series.length === 0) {
      return (
        <div
          ref={ref}
          className={clsx(styles.chartContainer, styles['chartContainer--empty'], className)}
          {...restProps}
        >
          <div className={styles.emptyMessage}>No series configured</div>
        </div>
      );
    }

    return (
      <div ref={ref} className={containerClassName} {...restProps}>
        <ComboChartContent
          data={data}
          series={series}
          leftYAxis={leftYAxis}
          rightYAxis={rightYAxis}
          showLegend={showLegend}
          legendPosition={legendPosition}
          grid={grid}
          chartMargin={chartMargin}
          xAxisPadding={xAxisPadding}
        />
      </div>
    );
  }
);

ComboChart.displayName = 'ComboChart';
