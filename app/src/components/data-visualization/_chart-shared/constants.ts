/**
 * Shared Chart Design Constants
 *
 * Centralized configuration for chart layout, styling, and colors.
 * These values ensure consistent appearance across chart components.
 */

import { chartBlackAlpha, use } from "../../../global-styles/colors";

/* -------------------------------------------------------------------------- */
/*                           Default Color Scheme                             */
/* -------------------------------------------------------------------------- */

/**
 * Default color palette for chart series.
 * Uses CSS variables from the global color system for theme support.
 *
 * @see app/src/global-styles/color.scss
 */
export const DEFAULT_COLOR_SCHEME = [
  'var(--chart-rainbow-blue-100)',    // #1364E6
  'var(--chart-rainbow-green-100)',   // #22A55B
  'var(--chart-rainbow-orange-100)',  // #E16F24
  'var(--chart-rainbow-red-100)',     // #FF4646
  'var(--chart-rainbow-purple-100)',  // #8250DF
  'var(--chart-rainbow-pink-100)',    // #E960AE
  'var(--chart-rainbow-yellow-100)',  // #D69F18
] as const;

/**
 * Named chart colors for programmatic access.
 */
export const CHART_COLORS = {
  blue: 'var(--chart-rainbow-blue-100)',
  green: 'var(--chart-rainbow-green-100)',
  orange: 'var(--chart-rainbow-orange-100)',
  red: 'var(--chart-rainbow-red-100)',
  purple: 'var(--chart-rainbow-purple-100)',
  pink: 'var(--chart-rainbow-pink-100)',
  yellow: 'var(--chart-rainbow-yellow-100)',
} as const;

export type ChartColorName = keyof typeof CHART_COLORS;

/* -------------------------------------------------------------------------- */
/*                              Opacity Values                                */
/* -------------------------------------------------------------------------- */

/**
 * Opacity values for selection states.
 */
export const OPACITY = {
  /** Opacity for selected/active elements */
  selected: 1,
  /** Opacity for unselected/inactive elements */
  unselected: 0.475,
  /** Opacity for disabled elements */
  disabled: 0.3,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Typography                                    */
/* -------------------------------------------------------------------------- */

/**
 * Typography settings for chart elements.
 */
export const TYPOGRAPHY = {
  /** Axis label font size (pixels) */
  axisLabelFontSize: 10,
  /** Axis label line height (pixels) */
  axisLabelLineHeight: 14,
  /** Axis label color - uses CSS variable with fallback for SVG rendering */
  axisLabelColor: 'var(--chart-black-alpha-60, rgba(0, 0, 0, 0.6))',

  /** Legend text font size (pixels) */
  legendFontSize: 12,
  /** Legend text line height (pixels) */
  legendLineHeight: 20,
  /** Legend icon size (pixels) */
  legendIconSize: 16,

  /** Tooltip font size (pixels) */
  tooltipFontSize: 12,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Spacing                                       */
/* -------------------------------------------------------------------------- */

/**
 * Default spacing values for charts.
 */
export const SPACING = {
  /** Default chart margin (outer spacing) */
  chartMargin: {
    top: 16,
    right: 16,
    bottom: 0,
    left: 16,
  },
  /** Default X-axis padding */
  xAxisPadding: {
    left: 10,
    right: 10,
  },
  /** Legend area height (pixels) */
  legendAreaHeight: 48,
  /** Gap between legend items (pixels) */
  legendGap: 24,
  /** Gap between legend icon and text (pixels) */
  legendItemGap: 8,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Y-Axis                                        */
/* -------------------------------------------------------------------------- */

/**
 * Y-axis configuration.
 */
export const Y_AXIS = {
  /** Default width for Y-axis labels area (pixels) */
  width: 40,
  /** Whether to show Y-axis label by default */
  showLabel: false,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Legend                                        */
/* -------------------------------------------------------------------------- */

/**
 * Legend configuration defaults.
 */
export const LEGEND = {
  /** Default icon when none specified */
  defaultIcon: 'commit',
  /** Default position */
  defaultPosition: 'bottom' as const,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Line/Area Charts                              */
/* -------------------------------------------------------------------------- */

/**
 * Default values for line/area charts.
 */
export const LINE_CHART = {
  /** Default stroke width for lines */
  strokeWidth: 2,
  /** Default dot radius */
  dotRadius: 3,

  /** Default dot fill color */
  dotFill: use["bg-prime"],
  /** Default dot stroke color */
  dotStroke: use["border-prime"],
  /** Default dot stroke width */
  dotStrokeWidth: 1,
  /** Active dot radius (on hover) */
  activeDotRadius: 6,
  /** Default fill opacity for area charts */
  areaFillOpacity: 0.3,
  /** Fill opacity for line-area mode */
  lineAreaFillOpacity: 0.15,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Column/Bar Charts                             */
/* -------------------------------------------------------------------------- */

/**
 * Default values for column/bar charts.
 */
export const COLUMN_CHART = {
  /** Default bar width (barSize) */
  barSize: 16,
  /** Default bar gap (space between bars in same category) */
  barGap: 4,
  /** Default category gap (percentage string) */
  barCategoryGap: '20%',
  /** Default border radius for bars [topLeft, topRight, bottomRight, bottomLeft] */
  radius: [4, 4, 0, 0] as [number, number, number, number],
} as const;

/* -------------------------------------------------------------------------- */
/*                              Grid                                          */
/* -------------------------------------------------------------------------- */

/**
 * Grid configuration with independent control over borders and grid lines.
 * 
 * Terminology:
 * - **Borders**: The outer frame lines of the chart area (top, right, bottom, left edges)
 * - **Grid lines**: Internal lines aligned with axis ticks that help read values
 * 
 * ⚠️ **KNOWN BUG**: Due to Recharts CartesianGrid clipping issues, the following
 * properties DO NOT work correctly and should NOT be used:
 * - showLeftBorder, showRightBorder, showTopBorder, showBottomBorder
 * - showVerticalGrid (renders borders instead of grid lines)
 * 
 * See: _chart-shared/known-bugs.md for details.
 */
export const GRID = {
  /** Grid stroke color - uses rgba for SVG compatibility */
  strokeColor: use["border-prime-trans"],
  
  /* Border configuration (chart frame edges) */
  /** Whether to show left border line (chart frame edge) */
  showLeftBorder: false,
  /** Whether to show right border line (chart frame edge) */
  showRightBorder: false,
  /** Whether to show top border line (chart frame edge) */
  showTopBorder: false,
  /** Whether to show bottom border line (chart frame edge) */
  showBottomBorder: false,
  
  /* Grid line configuration (internal tick-aligned lines) */
  /** Whether to show vertical grid lines at X-axis tick positions */
  showVerticalGrid: false,
  /** Whether to show horizontal grid lines at Y-axis tick positions */
  showHorizontalGrid: true,
  
  /** Top offset to prevent Y-axis label from being cut off (pixels) */
  topOffset: 8,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Hover/Cursor                                  */
/* -------------------------------------------------------------------------- */

/**
 * Hover and tooltip cursor styling.
 * Colors include built-in transparency (no separate opacity control needed).
 */
export const HOVER = {
  /** Background fill color for tooltip cursor area */
  areaFill: chartBlackAlpha["6"],
  /** Stroke color for tooltip cursor line */
  cursorStroke: chartBlackAlpha["10"],
} as const;

/* -------------------------------------------------------------------------- */
/*                           Display Mode Defaults                            */
/* -------------------------------------------------------------------------- */

/**
 * Display mode for line/area series.
 * - 'line': Line chart only
 * - 'line-area': Line with filled area underneath
 * - 'area': Filled area only (no stroke on top)
 */
export type LineDisplayMode = 'line' | 'line-area' | 'area';

/**
 * Default fill opacity by display mode.
 */
export const FILL_OPACITY_BY_MODE: Record<LineDisplayMode, number> = {
  line: 0,
  'line-area': LINE_CHART.lineAreaFillOpacity,
  area: LINE_CHART.areaFillOpacity,
} as const;

/**
 * Default stroke width by display mode.
 */
export const STROKE_WIDTH_BY_MODE: Record<LineDisplayMode, number> = {
  line: LINE_CHART.strokeWidth,
  'line-area': LINE_CHART.strokeWidth,
  area: 0, // No stroke for area-only mode
} as const;
