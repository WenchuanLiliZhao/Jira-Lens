/**
 * DistributionBar Component Types
 * 
 * ========== TYPE REFERENCE (调试用) ==========
 * 
 * DistributionBarSegment:
 *   id: string          - Unique identifier
 *   name: string        - Display name
 *   value: number       - Numeric value (determines width)
 *   color: string       - Segment color (CSS color or var())
 *   icon?: string       - Optional Material icon name
 * 
 * Size options: 'sm' | 'md' | 'lg' | number
 * Label display: 'always' | 'hover' | 'none'
 * ============================================
 */

import React from 'react';

/* -------------------------------------------------------------------------- */
/*                              Data Types                                    */
/* -------------------------------------------------------------------------- */

/**
 * Represents a single segment in the distribution bar.
 */
export interface DistributionBarSegment {
  /** Unique identifier for the segment */
  id: string;
  /** Display name for the segment */
  name: string;
  /** Numeric value (determines segment width proportionally) */
  value: number;
  /** Color for this segment (hex, rgb, or CSS variable) */
  color: string;
  /** Optional Material icon name to display in legend */
  icon?: string;
}

/**
 * Internal segment data with computed percentage.
 */
export interface DistributionBarInternalSegment extends DistributionBarSegment {
  /** Computed percentage (0-100) */
  percentage: number;
  /** Reference to original segment */
  originalSegment: DistributionBarSegment;
}

/* -------------------------------------------------------------------------- */
/*                              Component Props                               */
/* -------------------------------------------------------------------------- */

export interface DistributionBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Array of segments to display. Each segment's width is proportional to its value. */
  data: DistributionBarSegment[];

  /* === Size Configuration === */

  /**
   * Height of the bar.
   * - 'sm': 8px
   * - 'md': 16px (default)
   * - 'lg': 24px
   * - number: custom height in pixels
   */
  height?: 'sm' | 'md' | 'lg' | number;

  /**
   * Border radius of the bar in pixels.
   * @default 4
   */
  borderRadius?: number;

  /**
   * Gap between segments in pixels.
   * @default 1
   */
  gap?: number;

  /* === Label Configuration === */

  /**
   * When to display percentage labels on segments.
   * - 'always': Labels always visible
   * - 'hover': Labels only visible on hover (default)
   * - 'none': No labels displayed
   */
  showLabels?: 'always' | 'hover' | 'none';

  /* === Legend Configuration === */

  /**
   * Whether to show legend below the bar.
   * @default true
   */
  showLegend?: boolean;

  /* === Tooltip Configuration === */

  /**
   * Whether to show tooltip on hover.
   * @default true
   */
  showTooltip?: boolean;

  /**
   * Custom formatter for tooltip content.
   * Receives the segment data and computed percentage.
   */
  tooltipFormatter?: (segment: DistributionBarSegment, percentage: number) => React.ReactNode;

  /* === Animation === */

  /**
   * Whether to animate segment widths on mount.
   * @default true
   */
  animated?: boolean;

  /* === Interaction Callbacks === */

  /**
   * Callback when a segment is clicked.
   */
  onSegmentClick?: (segment: DistributionBarSegment) => void;

  /**
   * Callback when a segment is hovered.
   * Called with null when mouse leaves.
   */
  onSegmentHover?: (segment: DistributionBarSegment | null) => void;

  /** Custom class name */
  className?: string;
}
