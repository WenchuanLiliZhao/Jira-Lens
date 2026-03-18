/**
 * PieChart Component Types
 */

import React from 'react';

/* -------------------------------------------------------------------------- */
/*                              Data Types                                    */
/* -------------------------------------------------------------------------- */

/**
 * Represents a single data item in the pie chart.
 */
export interface PieChartDataItem {
  /** Unique identifier for the data item */
  id: string;
  /** Display name for the slice */
  name: string;
  /** Numeric value for the slice (determines slice size) */
  value: number;
  /** Color for this slice (hex, rgb, or CSS color) */
  color: string;
  /** Optional unit to display with the value (e.g., '%', 'pax') */
  unit?: string;
  /** Optional different value to show in legend (defaults to value) */
  legendValue?: number;
  /** Optional different unit to show in legend (defaults to unit) */
  legendUnit?: string;
  /** Optional Material icon name to display in legend */
  icon?: string;
}

/**
 * Internal data format used by Recharts Pie component.
 * Extends PieChartDataItem with original reference.
 */
export interface PieChartInternalData extends PieChartDataItem {
  /** Reference to the original data item */
  originalItem: PieChartDataItem;
}

/* -------------------------------------------------------------------------- */
/*                              Component Props                               */
/* -------------------------------------------------------------------------- */

export interface PieChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Chart data array. Each item represents a slice in the pie. */
  data: PieChartDataItem[];

  /* === Size Configuration === */

  /**
   * Diameter of the pie chart in pixels.
   * Use PIE_CHART_SIZES constants for common presets (sm: 80, md: 120, lg: 160).
   * @default 120
   */
  size?: number;

  /**
   * Width of the ring (donut thickness) in pixels.
   * @default 24
   */
  ringWidth?: number;

  /* === Legend Configuration === */

  /**
   * Position of the legend relative to the chart.
   * - 'bottom': Legend below the chart (default)
   * - 'right': Legend to the right of the chart
   * - 'none': No legend displayed
   */
  legendPosition?: 'bottom' | 'right' | 'none';

  /**
   * Width of the legend container in pixels.
   * Only applies when legendPosition is 'right'.
   * @default 200
   */
  legendWidth?: number;

  /**
   * Whether to show numeric values in the legend.
   * @default false
   */
  showLegendValue?: boolean;

  /**
   * Whether to show units in the legend.
   * @default false
   */
  showLegendUnit?: boolean;

  /* === Label Configuration === */

  /**
   * When to display labels on the chart slices.
   * - 'always': Labels always visible
   * - 'hover': Labels only visible on hover (default)
   * - 'none': No labels displayed
   */
  labelDisplay?: 'always' | 'hover' | 'none';

  /**
   * Whether to show units in the chart labels.
   * @default true
   */
  showLabelUnit?: boolean;

  /* === Tooltip Configuration === */

  /**
   * Whether to show tooltip on hover.
   * @default true
   */
  showTooltip?: boolean;

  /**
   * Custom formatter for tooltip content.
   * Receives the data item and should return a React node.
   */
  tooltipFormatter?: (item: PieChartDataItem) => React.ReactNode;

  /* === Color Configuration === */

  /**
   * Default color scheme to use when data items don't have colors.
   * Array of color values that will be cycled through.
   */
  colorScheme?: string[];

  /* === Interaction Callbacks === */

  /**
   * Callback when a slice is clicked.
   */
  onSliceClick?: (item: PieChartDataItem) => void;

  /**
   * Callback when a slice is hovered.
   * Called with null when mouse leaves the chart.
   */
  onSliceHover?: (item: PieChartDataItem | null) => void;

  /* === Spacing === */

  /**
   * Spacing between the pie chart and legend in pixels.
   * @default 24
   */
  spacing?: number;

  /** Custom class name */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                          Recharts Label Props                              */
/* -------------------------------------------------------------------------- */

/**
 * Props passed to the custom label renderer by Recharts.
 */
export interface PieLabelRenderProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
  value: number;
  payload: PieChartInternalData;
}

/* -------------------------------------------------------------------------- */
/*                          Label Positioning Types                           */
/* -------------------------------------------------------------------------- */

/**
 * Represents the calculated position of a label after collision avoidance.
 * Used by the dual-column layout algorithm.
 */
export interface LabelPosition {
  /** Index of the data item this label corresponds to */
  index: number;
  /** Label X coordinate (fixed on the column line) */
  x: number;
  /** Label Y coordinate (adjusted after collision resolution) */
  y: number;
  /** Pie edge X coordinate (guide line start point) */
  originalX: number;
  /** Pie edge Y coordinate (guide line start point) */
  originalY: number;
  /** Guide line elbow X coordinate */
  elbowX: number;
  /** Guide line elbow Y coordinate */
  elbowY: number;
  /** Text anchor for the label ('start' for right side, 'end' for left side) */
  textAnchor: 'start' | 'end';
  /** Display value for the label */
  value: number;
  /** Optional unit to display with the value */
  unit?: string;
  /** Color of the slice (for potential styling) */
  color: string;
  /** Original mid angle of the slice (in degrees) */
  midAngle: number;
}
