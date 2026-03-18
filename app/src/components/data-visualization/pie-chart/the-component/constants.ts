/**
 * PieChart Design Constants
 *
 * Centralized configuration for chart layout and styling.
 * These values ensure consistent sizing and spacing across the component.
 */

/* -------------------------------------------------------------------------- */
/*                              Size Presets                                  */
/* -------------------------------------------------------------------------- */

/**
 * Predefined size options for the pie chart diameter (in pixels).
 * Use these as values for the `size` prop for common chart sizes.
 * 
 * @example
 * ```tsx
 * <PieChart data={data} size={PIE_CHART_SIZES.lg} />
 * ```
 */
export const PIE_CHART_SIZES = {
  sm: 80,
  md: 120,
  lg: 160,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Default Design Values                            */
/* -------------------------------------------------------------------------- */

/**
 * Default design properties for the pie chart.
 */
export const DEFAULT_DESIGN = {
  /** Default diameter of the pie chart in pixels */
  defaultDiameter: 120,

  /** Default ring width (donut thickness) in pixels */
  ringWidth: 24,

  /** Default spacing between chart and legend in pixels */
  spacing: 24,

  /** Default legend width when positioned on the right (pixels) */
  legendWidth: 200,

  /** Multiplier for positioning labels outside the pie (1.125 = 112.5% of radius) */
  labelRadiusMultiplier: 1.125,

  /** Horizontal gap between legend items (pixels) */
  legendGapX: 8,

  /** Vertical gap between legend items (pixels) */
  legendGapY: 8,

  /** Start angle for the pie (90 = top) */
  startAngle: 90,

  /** End angle for the pie (-270 = full circle clockwise from top) */
  endAngle: -270,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Default Color Scheme                             */
/* -------------------------------------------------------------------------- */

/**
 * Default color palette for pie chart slices.
 * Uses CSS variables from the global color system (color.scss).
 * These colors support both light and dark modes automatically.
 * 
 * @see app/src/global-styles/color.scss
 * @see app/src/global-styles/colors.ts
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
 * Color scheme as importable TypeScript constants.
 * Use these when you need to reference colors programmatically.
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
/*                              Typography                                    */
/* -------------------------------------------------------------------------- */

/**
 * Typography settings for chart elements.
 */
export const TYPOGRAPHY = {
  /** Label font size on the chart (pixels) */
  labelFontSize: 10,

  /** Label line height on the chart (pixels) */
  labelLineHeight: 14,

  /** Legend text font size (pixels) */
  legendFontSize: 12,

  /** Legend text line height (pixels) */
  legendLineHeight: 20,

  /** Legend icon size (pixels) */
  legendIconSize: 16,
} as const;

/* -------------------------------------------------------------------------- */
/*                        Label Collision Avoidance                           */
/* -------------------------------------------------------------------------- */

/**
 * Configuration for the label collision avoidance algorithm.
 * Used by the dual-column layout system.
 */
export const LABEL_COLLISION = {
  /** Minimum vertical gap between labels (pixels) */
  minLabelGap: 14,

  /** Multiplier for label column position (1.35 = 135% of outer radius) */
  labelRadiusOuter: 1.35,

  /** Multiplier for guide line elbow position (1.15 = 115% of outer radius) */
  labelRadiusMiddle: 1.15,

  /** Padding ratio from boundary (0.1 = 10% padding from edges) */
  boundaryPadding: 0.1,

  /** Threshold for triggering centering optimization (pixels) */
  centeringThreshold: 2,

  /** Factor for centering adjustment (0.5 = move halfway to center) */
  centeringFactor: 0.5,

  /** Maximum number of labels allowed per side before dynamic gap adjustment */
  maxLabelsPerSide: 12,

  /** Minimum slice percentage to show a label (slices below this threshold hide labels) */
  minSlicePercent: 0.5,
} as const;
