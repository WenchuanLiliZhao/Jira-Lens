/**
 * Treemap Design Constants
 *
 * Centralized configuration for chart layout and styling.
 * These values ensure consistent sizing and spacing across the component.
 */

import { use } from "../../../../global-styles/colors";

/* -------------------------------------------------------------------------- */
/*                           Default Design Values                            */
/* -------------------------------------------------------------------------- */

/**
 * Default design properties for the treemap.
 */
export const DEFAULT_DESIGN = {
  /** Default width of the treemap in pixels */
  width: 400,

  /** Default height of the treemap in pixels */
  height: 300,

  /** Default aspect ratio for layout algorithm */
  aspectRatio: 4 / 3,

  /** Default stroke color for cell borders */
  strokeColor: use["bg-prime"],

  /** Default stroke width for cell borders */
  strokeWidth: 2,

  /** Minimum cell width to show label (pixels) */
  minLabelWidth: 60,

  /** Minimum cell height to show label (pixels) */
  minLabelHeight: 30,

  /** Cell padding (inner spacing) in pixels */
  cellPadding: 4,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Default Color Scheme                             */
/* -------------------------------------------------------------------------- */

/**
 * Default color palette for treemap nodes.
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
 * Typography settings for treemap cell labels.
 * Supports 3-line layout: name, subtitle, tertiaryLabel
 * 
 * Layout:
 * ┌─────────────────────┐
 * │      Leggings       │  ← name (14px, bold)
 * │      WOS: 2.4       │  ← subtitle (12px, normal)
 * │    11.7% (27K)      │  ← tertiaryLabel (12px, colored)
 * └─────────────────────┘
 */
export const TYPOGRAPHY = {
  /* === Name (第一行 - 主标题) === */
  
  /** Name font size (pixels) */
  nameFontSize: 14,
  
  /** Name font weight */
  nameFontWeight: 600,
  
  /** Name color */
  nameColor: '#fff',

  /* === Subtitle (第二行 - 副标题) === */
  
  /** Subtitle font size (pixels) */
  subtitleFontSize: 12,
  
  /** Subtitle font weight */
  subtitleFontWeight: 400,
  
  /** Subtitle color */
  subtitleColor: '#fff',

  /* === Tertiary (第三行 - 数值/百分比) === */
  
  /** Tertiary label font size (pixels) */
  tertiaryFontSize: 12,
  
  /** Tertiary label font weight */
  tertiaryFontWeight: 400,
  
  /** Tertiary label default color (can be overridden per item) */
  tertiaryColor: 'rgba(255, 255, 255, 0.72)',

  /* === Spacing === */
  
  /** Gap between text lines (pixels) */
  lineGap: 4,
} as const;

/* -------------------------------------------------------------------------- */
/*                              Opacity Values                                */
/* -------------------------------------------------------------------------- */

/**
 * Opacity values for different states and depth levels.
 */
export const OPACITY = {
  /** Base opacity for root level nodes */
  rootLevel: 1,

  /** Opacity reduction per depth level */
  depthReduction: 0.15,

  /** Minimum opacity for deeply nested nodes */
  minOpacity: 0.4,

  /** Opacity for hovered state */
  hover: 0.85,

  /** Opacity for inactive/dimmed nodes */
  inactive: 0.5,
} as const;
