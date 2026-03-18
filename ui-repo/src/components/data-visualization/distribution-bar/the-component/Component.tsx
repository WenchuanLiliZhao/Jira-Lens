/**
 * DistributionBar Component - Main Implementation
 *
 * A horizontal bar showing proportional segments (e.g., budget allocation,
 * vote share, category mix). Each segment's width is computed from its value
 * relative to the total.
 *
 * ========== PROPS REFERENCE (调试用) ==========
 * 
 * data: DistributionBarSegment[]  - Required segment data
 * height: 'sm'|'md'|'lg'|number   - Bar height (default: 'md')
 * borderRadius: number            - Corner radius (default: 4)
 * gap: number                     - Segment gap (default: 1)
 * showLabels: 'always'|'hover'|'none' - Label display (default: 'hover')
 * showLegend: boolean             - Show legend (default: true)
 * showTooltip: boolean            - Show tooltip (default: true)
 * animated: boolean               - Animate on mount (default: true)
 * ============================================
 *
 * @example
 * ```tsx
 * <DistributionBar
 *   data={[
 *     { id: '1', name: 'Category A', value: 45, color: CHART_COLORS.blue },
 *     { id: '2', name: 'Category B', value: 30, color: CHART_COLORS.green },
 *     { id: '3', name: 'Category C', value: 25, color: CHART_COLORS.orange },
 *   ]}
 *   height="md"
 *   showLegend
 * />
 * ```
 */

import React from 'react';
import clsx from 'clsx';
import type { DistributionBarProps } from './types';
import { DEFAULT_DESIGN } from './constants';

import styles from './styles.module.scss';
import { DistributionBarContent } from './ComponentContent';

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const DistributionBar = React.forwardRef<HTMLDivElement, DistributionBarProps>(
  (props, ref) => {
    const {
      // Data
      data,
      // Size
      height = DEFAULT_DESIGN.height,
      borderRadius = DEFAULT_DESIGN.borderRadius,
      gap = DEFAULT_DESIGN.gap,
      // Labels
      showLabels = 'hover',
      // Legend
      showLegend = true,
      // Tooltip
      showTooltip = true,
      tooltipFormatter,
      // Animation
      animated = true,
      // Interactions
      onSegmentClick,
      onSegmentHover,
      // DOM
      className,
      ...restProps
    } = props;

    // Build className
    const containerClassName = clsx(
      styles.container,
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
        <DistributionBarContent
          data={data}
          height={height}
          borderRadius={borderRadius}
          gap={gap}
          showLabels={showLabels}
          showLegend={showLegend}
          showTooltip={showTooltip}
          tooltipFormatter={tooltipFormatter}
          animated={animated}
          onSegmentClick={onSegmentClick}
          onSegmentHover={onSegmentHover}
        />
      </div>
    );
  }
);

DistributionBar.displayName = 'DistributionBar';
