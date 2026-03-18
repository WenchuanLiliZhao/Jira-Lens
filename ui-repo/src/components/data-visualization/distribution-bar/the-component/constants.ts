/**
 * DistributionBar Design Constants
 *
 * ========== DESIGN TOKENS (调试用) ==========
 * 
 * HEIGHT PRESETS:
 *   sm: 8px | md: 16px | lg: 24px
 * 
 * BORDER RADIUS:
 *   default: 4px
 * 
 * SEGMENT GAP:
 *   default: 1px
 * 
 * ANIMATION:
 *   duration: 300ms | easing: ease-out
 * 
 * COLORS (from chartRainbow):
 *   blue-100, green-100, orange-100, red-100, purple-100, pink-100, yellow-100
 * ============================================
 */

/* -------------------------------------------------------------------------- */
/*                              Size Presets                                  */
/* -------------------------------------------------------------------------- */

/**
 * Predefined height options for the distribution bar (in pixels).
 */
export const HEIGHT_PRESETS = {
  sm: 4,
  md: 8,
  lg: 16,
} as const;

export type HeightPreset = keyof typeof HEIGHT_PRESETS;

/* -------------------------------------------------------------------------- */
/*                           Default Design Values                            */
/* -------------------------------------------------------------------------- */

/**
 * Default design properties for the distribution bar.
 */
export const DEFAULT_DESIGN = {
  /** Default height preset */
  height: 'md' as HeightPreset,

  /** Default border radius in pixels */
  borderRadius: 4,

  /** Default gap between segments in pixels */
  gap: 1,

  /** Animation duration in milliseconds */
  animationDuration: 300,

  /** Animation easing function */
  animationEasing: 'ease-out',

  /** Legend gap from bar in pixels */
  legendGap: 12,

  /** Legend item horizontal gap in pixels */
  legendItemGapX: 16,

  /** Legend item vertical gap in pixels */
  legendItemGapY: 8,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Default Color Scheme                             */
/* -------------------------------------------------------------------------- */

/**
 * Default color palette for distribution bar segments.
 * Uses CSS variables from the global color system (color.scss).
 * These colors support both light and dark modes automatically.
 * 
 * @see ui-repo/src/global-styles/color.scss
 * @see ui-repo/src/global-styles/colors.ts
 */
export const DEFAULT_COLOR_SCHEME = [
  'var(--chart-rainbow-blue-100)',
  'var(--chart-rainbow-green-100)',
  'var(--chart-rainbow-orange-100)',
  'var(--chart-rainbow-red-100)',
  'var(--chart-rainbow-purple-100)',
  'var(--chart-rainbow-pink-100)',
  'var(--chart-rainbow-yellow-100)',
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
 * Typography settings for component elements.
 */
export const TYPOGRAPHY = {
  /** Label font size on segments (pixels) */
  labelFontSize: 10,

  /** Label line height (pixels) */
  labelLineHeight: 14,

  /** Legend text font size (pixels) */
  legendFontSize: 12,

  /** Legend text line height (pixels) */
  legendLineHeight: 20,

  /** Legend color dot size (pixels) */
  legendDotSize: 10,
} as const;
