/**
 * ComboChart Design Tokens & Constants
 *
 * Centralized configuration for ComboChart-specific styling and behavior.
 * Inherits from shared chart constants but provides combo-chart-specific overrides.
 */

import {
  SPACING as SHARED_SPACING,
  Y_AXIS as SHARED_Y_AXIS,
  COLUMN_CHART,
  LINE_CHART,
  TYPOGRAPHY as SHARED_TYPOGRAPHY,
  GRID as SHARED_GRID,
  HOVER,
} from '../../_chart-shared';

// Re-export from shared for convenience
export { FILL_OPACITY_BY_MODE, STROKE_WIDTH_BY_MODE } from '../../_chart-shared';

/* -------------------------------------------------------------------------- */
/*                           Typography & Text Sizes                          */
/* -------------------------------------------------------------------------- */

/**
 * Typography settings for combo chart elements.
 * Uses shared typography values for consistency.
 */
export const TYPOGRAPHY = {
  /** Axis label font size (pixels) */
  axisLabelFontSize: SHARED_TYPOGRAPHY.axisLabelFontSize,
  /** Axis label color */
  axisLabelColor: SHARED_TYPOGRAPHY.axisLabelColor,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Spacing & Layout                                 */
/* -------------------------------------------------------------------------- */

/**
 * ComboChart-specific spacing values.
 * Uses shared spacing for consistency with other charts.
 */
export const SPACING = {
  ...SHARED_SPACING,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Y-Axis Configuration                             */
/* -------------------------------------------------------------------------- */

/**
 * Y-axis configuration for dual-axis setup.
 */
export const Y_AXIS = {
  ...SHARED_Y_AXIS,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Column Series Defaults                           */
/* -------------------------------------------------------------------------- */

/**
 * Default configuration for column series in combo charts.
 */
export const COMBO_COLUMN = {
  /** Default bar width (pixels) */
  barSize: COLUMN_CHART.barSize,
  /** Default border radius for bars */
  radius: COLUMN_CHART.radius,
  /** Default Y-axis assignment for columns */
  defaultYAxisId: 'left' as const,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Line Series Defaults                             */
/* -------------------------------------------------------------------------- */

/**
 * Default configuration for line series in combo charts.
 */
export const COMBO_LINE = {
  /** Default stroke width for lines */
  strokeWidth: LINE_CHART.strokeWidth,
  /** Default dot radius */
  dotRadius: LINE_CHART.dotRadius,
  /** Default dot fill color */
  dotFill: LINE_CHART.dotFill,
  /** Default dot stroke width */
  dotStrokeWidth: LINE_CHART.dotStrokeWidth,
  /** Active dot radius (on hover) */
  activeDotRadius: LINE_CHART.activeDotRadius,
  /** Default Y-axis assignment for lines */
  defaultYAxisId: 'right' as const,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Grid Configuration                               */
/* -------------------------------------------------------------------------- */

/**
 * Grid configuration - uses shared values.
 */
export const GRID = {
  /** Grid stroke color */
  strokeColor: SHARED_GRID.strokeColor,
  /** Top offset to prevent Y-axis label clipping */
  topOffset: SHARED_GRID.topOffset,
  /** Show left border */
  showLeftBorder: SHARED_GRID.showLeftBorder,
  /** Show right border */
  showRightBorder: SHARED_GRID.showRightBorder,
  /** Show top border */
  showTopBorder: SHARED_GRID.showTopBorder,
  /** Show bottom border */
  showBottomBorder: SHARED_GRID.showBottomBorder,
  /** Show vertical grid lines (at X-axis ticks) */
  showVerticalGrid: SHARED_GRID.showVerticalGrid,
  /** Show horizontal grid lines (at Y-axis ticks) */
  showHorizontalGrid: SHARED_GRID.showHorizontalGrid,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Tooltip Configuration                            */
/* -------------------------------------------------------------------------- */

/**
 * Tooltip cursor styling for combo charts.
 * Uses shared HOVER values for consistency.
 */
export const TOOLTIP = {
  /** Cursor fill color (semi-transparent) */
  cursorFill: HOVER.areaFill,
} as const;
