/**
 * Treemap Component Types
 */

import React from 'react';
import type { LegendPosition } from '../../_chart-shared';

/* -------------------------------------------------------------------------- */
/*                              Data Types                                    */
/* -------------------------------------------------------------------------- */

/**
 * Represents a single node in the treemap.
 * Can be a leaf node (with value) or a parent node (with children).
 * 
 * Supports 3-line label layout:
 * - Line 1: name (required)
 * - Line 2: subtitle (optional)
 * - Line 3: tertiaryLabel (optional, or auto-generated from value)
 */
export interface TreemapDataItem {
  /** Unique identifier for the node */
  id: string;
  
  /** Display name for the node (Line 1 - required) */
  name: string;
  
  /** Numeric value for leaf nodes (determines area size) */
  value?: number;
  
  /** Child nodes for hierarchical data */
  children?: TreemapDataItem[];
  
  /** Background color for this node (hex, rgb, or CSS color) */
  color?: string;

  /* === Multi-line Label Support === */
  
  /**
   * Subtitle text (Line 2 - optional)
   * Example: "WOS: 2.4"
   */
  subtitle?: string;
  
  /**
   * Tertiary label text (Line 3 - optional)
   * If not provided and showValue is true, will show formatted value with unit.
   * Example: "11.7% (27K)"
   */
  tertiaryLabel?: string;
  
  /**
   * Custom color for tertiary label.
   * Overrides the default TYPOGRAPHY.tertiaryColor.
   */
  tertiaryColor?: string;

  /* === Value Formatting === */
  
  /** Optional unit to display with the value (e.g., 'MB', '$') */
  unit?: string;
  
  /**
   * Position of the unit relative to the value.
   * - 'before': Unit appears before value (e.g., "$100")
   * - 'after': Unit appears after value (e.g., "100 MB")
   * @default 'after'
   */
  unitPosition?: 'before' | 'after';
}

/**
 * Internal data format used by Recharts Treemap component.
 * Extends TreemapDataItem with computed properties.
 */
export interface TreemapInternalNode extends TreemapDataItem {
  /** Computed fill color after color scheme assignment */
  fill: string;
  /** Original data item reference */
  originalItem: TreemapDataItem;
  /** Depth level in the hierarchy (0 = root) */
  depth: number;
  /** Index within parent's children array */
  index: number;
}

/* -------------------------------------------------------------------------- */
/*                              Component Props                               */
/* -------------------------------------------------------------------------- */

export interface TreemapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Chart data array. Each item represents a node in the treemap. */
  data: TreemapDataItem[];

  /* === Size Configuration === */

  /**
   * Width of the treemap container.
   * Can be a pixel value or '100%' for responsive width.
   * @default 400
   */
  width?: number | '100%';

  /**
   * Height of the treemap container.
   * Can be a pixel value or '100%' for responsive height.
   * @default 300
   */
  height?: number | '100%';

  /**
   * Aspect ratio for the treemap layout algorithm.
   * Higher values create more horizontal rectangles.
   * @default 4/3
   */
  aspectRatio?: number;

  /* === Display Configuration === */

  /**
   * Whether to show node labels inside cells.
   * Labels are only shown when cells are large enough.
   * @default true
   */
  showLabels?: boolean;

  /**
   * Minimum cell width (in pixels) to show label.
   * @default 60
   */
  minLabelWidth?: number;

  /**
   * Minimum cell height (in pixels) to show label.
   * @default 30
   */
  minLabelHeight?: number;

  /**
   * Whether to show value in the label.
   * @default true
   */
  showValue?: boolean;

  /* === Legend Configuration === */

  /**
   * Whether to show the legend.
   * @default false
   */
  showLegend?: boolean;

  /**
   * Position of the legend relative to the chart.
   * @default 'bottom'
   */
  legendPosition?: LegendPosition;

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
  tooltipFormatter?: (item: TreemapDataItem) => React.ReactNode;

  /* === Color Configuration === */

  /**
   * Color scheme to use when data items don't have colors.
   * Array of color values that will be assigned to root-level items.
   */
  colorScheme?: string[];

  /**
   * Stroke color for cell borders.
   * @default '#fff'
   */
  strokeColor?: string;

  /**
   * Stroke width for cell borders.
   * @default 2
   */
  strokeWidth?: number;

  /* === Interaction Callbacks === */

  /**
   * Callback when a node is clicked.
   */
  onNodeClick?: (item: TreemapDataItem) => void;

  /**
   * Callback when a node is hovered.
   * Called with null when mouse leaves the chart.
   */
  onNodeHover?: (item: TreemapDataItem | null) => void;

  /** Custom class name */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                          Recharts Content Props                            */
/* -------------------------------------------------------------------------- */

/**
 * Props passed to the custom content renderer by Recharts Treemap.
 */
export interface TreemapContentProps {
  /** X coordinate of the cell */
  x: number;
  /** Y coordinate of the cell */
  y: number;
  /** Width of the cell */
  width: number;
  /** Height of the cell */
  height: number;
  /** Depth in the hierarchy (0 = root level) */
  depth: number;
  /** Index of the node */
  index: number;
  /** Name of the node */
  name: string;
  /** Value of the node */
  value: number;
  /** Fill color */
  fill: string;
  /** Root node reference */
  root: TreemapInternalNode;
  /** Current node payload */
  payload: TreemapInternalNode;
}
