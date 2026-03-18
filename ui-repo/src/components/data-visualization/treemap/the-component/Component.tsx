/**
 * Treemap Component - Main Implementation
 *
 * A data visualization component that displays hierarchical data through
 * nested rectangles, where the area of each rectangle represents its value.
 *
 * Features:
 * - Configurable size (fixed or responsive width)
 * - Hierarchical data support with nested children
 * - Custom color schemes
 * - Tooltip support with custom formatters
 * - Interactive click and hover callbacks
 * - Automatic label visibility based on cell size
 *
 * @example
 * ```tsx
 * <Treemap
 *   data={[
 *     { id: '1', name: 'Category A', value: 100, color: '#3B82F6' },
 *     { id: '2', name: 'Category B', value: 80, color: '#10B981' },
 *     { id: '3', name: 'Category C', children: [
 *       { id: '3-1', name: 'Sub C1', value: 30 },
 *       { id: '3-2', name: 'Sub C2', value: 20 },
 *     ]},
 *   ]}
 *   width={400}
 *   height={300}
 *   showTooltip
 * />
 * ```
 */

import React, { useMemo } from 'react';
import clsx from 'clsx';
import type { TreemapProps, TreemapDataItem } from './types';
import { DEFAULT_DESIGN, DEFAULT_COLOR_SCHEME } from './constants';
import { TreemapContent } from './ComponentContent';
import { ChartLegend } from '../../_chart-shared';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Assigns colors to data items using the color scheme.
 * Root-level items get colors from the scheme if they don't have a color defined.
 */
const getItemColor = (
  item: TreemapDataItem,
  index: number,
  colorScheme: string[]
): string => {
  return item.color || colorScheme[index % colorScheme.length];
};

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const Treemap = React.forwardRef<HTMLDivElement, TreemapProps>(
  (props, ref) => {
    const {
      // Data
      data,
      // Size
      width = DEFAULT_DESIGN.width,
      height = DEFAULT_DESIGN.height,
      aspectRatio = DEFAULT_DESIGN.aspectRatio,
      // Display
      showLabels = true,
      minLabelWidth = DEFAULT_DESIGN.minLabelWidth,
      minLabelHeight = DEFAULT_DESIGN.minLabelHeight,
      showValue = true,
      // Legend
      showLegend = false,
      legendPosition = 'bottom',
      // Tooltip
      showTooltip = true,
      tooltipFormatter,
      // Colors
      colorScheme,
      strokeColor = DEFAULT_DESIGN.strokeColor,
      strokeWidth = DEFAULT_DESIGN.strokeWidth,
      // Interactions
      onNodeClick,
      onNodeHover,
      // DOM
      className,
      ...restProps
    } = props;

    // Build className
    const containerClassName = clsx(styles.container, className);

    // Compute color scheme
    const colors = useMemo(
      () => colorScheme || (DEFAULT_COLOR_SCHEME as unknown as string[]),
      [colorScheme]
    );

    // Build legend items from data (root-level items only)
    const legendItems = useMemo(
      () =>
        data.map((item, index) => ({
          key: item.id,
          title: item.name,
          color: getItemColor(item, index, colors),
        })),
      [data, colors]
    );

    // Handle empty data
    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={clsx(styles.container, styles['container--empty'], className)}
          style={{
            width: width === '100%' ? '100%' : width,
            height: height === '100%' ? '100%' : height,
          }}
          {...restProps}
        >
          <div className={styles['empty-message']}>No data available</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={containerClassName}
        style={{
          width: width === '100%' ? '100%' : width,
          height: height === '100%' ? '100%' : height,
        }}
        {...restProps}
      >
        {/* Legend at top */}
        {showLegend && legendPosition === 'top' && (
          <ChartLegend items={legendItems} position="top" />
        )}

        {/* Chart area - takes remaining space after legend */}
        <div className={styles.chartArea}>
          <TreemapContent
            data={data}
            aspectRatio={aspectRatio}
            showLabels={showLabels}
            minLabelWidth={minLabelWidth}
            minLabelHeight={minLabelHeight}
            showValue={showValue}
            showTooltip={showTooltip}
            tooltipFormatter={tooltipFormatter}
            colorScheme={colorScheme}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            onNodeClick={onNodeClick}
            onNodeHover={onNodeHover}
          />
        </div>

        {/* Legend at bottom */}
        {showLegend && legendPosition === 'bottom' && (
          <ChartLegend items={legendItems} position="bottom" />
        )}
      </div>
    );
  }
);

Treemap.displayName = 'Treemap';
