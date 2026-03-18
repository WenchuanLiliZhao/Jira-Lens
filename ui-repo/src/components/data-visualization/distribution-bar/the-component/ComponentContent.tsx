/**
 * DistributionBar Component Content
 *
 * Contains the main rendering logic for the bar, segments, legend, and tooltip.
 *
 * ========== RENDERING LOGIC (调试用) ==========
 * 
 * PERCENTAGE CALCULATION:
 *   percentage = (segment.value / totalValue) * 100
 * 
 * SEGMENT WIDTH:
 *   Uses flex-grow with value as weight, or percentage for explicit widths
 * 
 * HOVER STATE:
 *   - Controlled via hoveredSegmentId state
 *   - Shows tooltip positioned above segment
 *   - Shows label overlay if showLabels === 'hover'
 * 
 * ANIMATION:
 *   - Initial render with width: 0
 *   - Animates to full width after mount
 * ============================================
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import type { DistributionBarProps, DistributionBarSegment, DistributionBarInternalSegment } from './types';
import { HEIGHT_PRESETS, DEFAULT_DESIGN, TYPOGRAPHY } from './constants';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Get height value in pixels from preset or number.
 */
function getHeightValue(height: DistributionBarProps['height']): number {
  if (typeof height === 'number') return height;
  return HEIGHT_PRESETS[height || 'md'];
}

/**
 * Process data to add computed percentages.
 */
function processData(data: DistributionBarSegment[]): DistributionBarInternalSegment[] {
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  if (total === 0) return [];

  return data.map(segment => ({
    ...segment,
    percentage: (segment.value / total) * 100,
    originalSegment: segment,
  }));
}

/* -------------------------------------------------------------------------- */
/*                              Content Props                                 */
/* -------------------------------------------------------------------------- */

interface DistributionBarContentProps {
  data: DistributionBarSegment[];
  height: DistributionBarProps['height'];
  borderRadius: number;
  gap: number;
  showLabels: 'always' | 'hover' | 'none';
  showLegend: boolean;
  showTooltip: boolean;
  tooltipFormatter?: DistributionBarProps['tooltipFormatter'];
  animated: boolean;
  onSegmentClick?: (segment: DistributionBarSegment) => void;
  onSegmentHover?: (segment: DistributionBarSegment | null) => void;
}

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const DistributionBarContent: React.FC<DistributionBarContentProps> = ({
  data,
  height,
  borderRadius,
  gap,
  showLabels,
  showLegend,
  showTooltip,
  tooltipFormatter,
  animated,
  onSegmentClick,
  onSegmentHover,
}) => {
  // State
  const [hoveredSegmentId, setHoveredSegmentId] = useState<string | null>(null);
  const [isAnimated, setIsAnimated] = useState(!animated);

  // Process data with percentages
  const processedData = useMemo(() => processData(data), [data]);

  // Get height value
  const heightValue = getHeightValue(height);

  // Animation effect
  useEffect(() => {
    if (animated) {
      // Small delay to trigger animation after mount
      const timer = requestAnimationFrame(() => {
        setIsAnimated(true);
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [animated]);

  // Handlers
  const handleSegmentMouseEnter = useCallback((segment: DistributionBarSegment) => {
    setHoveredSegmentId(segment.id);
    onSegmentHover?.(segment);
  }, [onSegmentHover]);

  const handleSegmentMouseLeave = useCallback(() => {
    setHoveredSegmentId(null);
    onSegmentHover?.(null);
  }, [onSegmentHover]);

  const handleSegmentClick = useCallback((segment: DistributionBarSegment) => {
    onSegmentClick?.(segment);
  }, [onSegmentClick]);

  // Get hovered segment data for tooltip
  const hoveredSegment = useMemo(() => {
    if (!hoveredSegmentId) return null;
    return processedData.find(s => s.id === hoveredSegmentId) || null;
  }, [hoveredSegmentId, processedData]);

  return (
    <div className={styles.content}>
      {/* Bar */}
      <div
        className={styles.bar}
        style={{
          height: heightValue,
          borderRadius,
          gap,
        }}
      >
        {processedData.map((segment, index) => {
          const isFirst = index === 0;
          const isLast = index === processedData.length - 1;
          const isHovered = hoveredSegmentId === segment.id;
          const showLabel = showLabels === 'always' || (showLabels === 'hover' && isHovered);

          return (
            <div
              key={segment.id}
              className={clsx(
                styles.segment,
                isHovered && styles['segment--hovered'],
                (onSegmentClick || onSegmentHover) && styles['segment--interactive']
              )}
              style={{
                backgroundColor: segment.color,
                flexGrow: isAnimated ? segment.value : 0,
                flexBasis: isAnimated ? 0 : 0,
                borderTopLeftRadius: isFirst ? borderRadius : 0,
                borderBottomLeftRadius: isFirst ? borderRadius : 0,
                borderTopRightRadius: isLast ? borderRadius : 0,
                borderBottomRightRadius: isLast ? borderRadius : 0,
              }}
              onMouseEnter={() => handleSegmentMouseEnter(segment.originalSegment)}
              onMouseLeave={handleSegmentMouseLeave}
              onClick={() => handleSegmentClick(segment.originalSegment)}
              role={onSegmentClick ? 'button' : undefined}
              tabIndex={onSegmentClick ? 0 : undefined}
              aria-label={`${segment.name}: ${segment.percentage.toFixed(1)}%`}
            >
              {/* Inline label */}
              {showLabel && heightValue >= 14 && (
                <span
                  className={styles['segment-label']}
                  style={{ fontSize: TYPOGRAPHY.labelFontSize }}
                >
                  {segment.percentage.toFixed(0)}%
                </span>
              )}

              {/* Tooltip */}
              {showTooltip && isHovered && hoveredSegment && (
                <div className={styles.tooltip}>
                  {tooltipFormatter ? (
                    tooltipFormatter(hoveredSegment.originalSegment, hoveredSegment.percentage)
                  ) : (
                    <div className={styles['tooltip-content']}>
                      <div className={styles['tooltip-header']}>
                        <span
                          className={styles['tooltip-color']}
                          style={{ backgroundColor: hoveredSegment.color }}
                        />
                        <span className={styles['tooltip-name']}>{hoveredSegment.name}</span>
                      </div>
                      <div className={styles['tooltip-value']}>
                        {hoveredSegment.value.toLocaleString()}
                        <span className={styles['tooltip-percentage']}>
                          ({hoveredSegment.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          className={styles.legend}
          style={{ marginTop: DEFAULT_DESIGN.legendGap }}
        >
          {processedData.map(segment => (
            <div
              key={segment.id}
              className={clsx(
                styles['legend-item'],
                hoveredSegmentId === segment.id && styles['legend-item--highlighted']
              )}
              onMouseEnter={() => handleSegmentMouseEnter(segment.originalSegment)}
              onMouseLeave={handleSegmentMouseLeave}
            >
              <span
                className={styles['legend-dot']}
                style={{
                  backgroundColor: segment.color,
                  width: TYPOGRAPHY.legendDotSize,
                  height: TYPOGRAPHY.legendDotSize,
                }}
              />
              <span className={styles['legend-text']}>{segment.name}</span>
              <span className={styles['legend-value']}>
                {segment.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
