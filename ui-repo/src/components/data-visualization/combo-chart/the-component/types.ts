/**
 * ComboChart Component Types
 *
 * Type definitions for the ComboChart component - a flexible dual-axis
 * combination chart supporting both column and line visualizations.
 */

import type {
  ChartDataPoint,
  BaseSeriesConfig,
  ChartMargin,
  ChartPadding,
  LegendPosition,
  LineDisplayMode,
  AxisNumberFormat,
  GridConfig,
} from '../../_chart-shared';

// Re-export LineDisplayMode for convenience
export type { LineDisplayMode };

/**
 * Y-axis identifier for mapping series to axes.
 */
export type YAxisId = 'left' | 'right';

/* -------------------------------------------------------------------------- */
/*                           Y-Axis Configuration                             */
/* -------------------------------------------------------------------------- */

/**
 * Configuration for a Y-axis.
 */
export interface YAxisConfig {
  /** Axis label */
  label?: string;

  /** Whether to show the axis label. Default: true */
  showLabel?: boolean;

  /** Preset number format for tick labels. Ignored if tickFormatter is provided. */
  format?: AxisNumberFormat;

  /** Decimal precision for 'decimal' format (default: 2) */
  decimalPrecision?: number;

  /** Custom domain (e.g., [0, 100] or ['auto', 'auto']) */
  domain?: [number, number] | [string, string];

  /** Custom tick values (e.g., [0, 25, 50, 75, 100]) */
  ticks?: number[];

  /** Unit to display with values (e.g., "%", "$", "K") */
  unit?: string;

  /** Custom tick formatter function. Takes precedence over format. */
  tickFormatter?: (value: number) => string;
}

/* -------------------------------------------------------------------------- */
/*                           Series Configuration                             */
/* -------------------------------------------------------------------------- */

/**
 * Configuration for a column (bar) series in the combo chart.
 */
export interface ComboColumnSeriesConfig extends BaseSeriesConfig {
  /** Series type discriminator */
  type: 'column';

  /** Which Y-axis to map to. Default: 'left'. For single-axis charts, always use 'left'. */
  yAxisId?: YAxisId;

  /** Bar width for this series (pixels) */
  barSize?: number;

  /** Border radius for bars (single value or [topLeft, topRight, bottomRight, bottomLeft]) */
  radius?: number | [number, number, number, number];
}

/**
 * Configuration for a line series in the combo chart.
 */
export interface ComboLineSeriesConfig extends BaseSeriesConfig {
  /** Series type discriminator */
  type: 'line';

  /** Which Y-axis to map to. Default: 'left'. For single-axis charts, always use 'left'. */
  yAxisId?: YAxisId;

  /* === Display Mode === */

  /** Display mode for this series. Default: 'line' */
  displayAs?: LineDisplayMode;

  /* === Line Styles === */

  /** Line stroke width (pixels). Default: 2 */
  strokeWidth?: number;

  /** Dash array for line (e.g., "5 5" for dashed, "2 2" for dotted) */
  strokeDasharray?: string;

  /* === Area Styles (for 'line-area' and 'area' modes) === */

  /** Fill color for area (defaults to a lighter version of color) */
  fillColor?: string;

  /** Fill opacity for area (0-1). Default: 0.2 */
  fillOpacity?: number;

  /** Whether to connect data points across null gaps. Default: false */
  connectNulls?: boolean;
}

/**
 * Union type for all series configurations.
 */
export type ComboSeriesConfig = ComboColumnSeriesConfig | ComboLineSeriesConfig;

/* -------------------------------------------------------------------------- */
/*                           Component Props                                  */
/* -------------------------------------------------------------------------- */

/**
 * Props for the ComboChart component.
 */
export interface ComboChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Chart data array. Each item represents a point on the X-axis. */
  data: ChartDataPoint[];

  /** Series configuration array. Each item defines how a data series is displayed. */
  series: ComboSeriesConfig[];

  /* === Y-Axis Configuration === */

  /** Left Y-axis configuration (optional, auto-detected if needed) */
  leftYAxis?: YAxisConfig;

  /** Right Y-axis configuration (optional, supports single-axis use case) */
  rightYAxis?: YAxisConfig;

  /* === Legend Configuration === */

  /** Whether to show the legend. Default: true */
  showLegend?: boolean;

  /** Position of the legend. Default: 'bottom' */
  legendPosition?: LegendPosition;

  /* === Grid Configuration === */

  /**
   * Grid configuration.
   * - `false` or `{ horizontal: false, vertical: false }`: Hide all grid lines
   * - `true` (default): Show horizontal grid lines only
   * - `{ horizontal?: boolean, vertical?: boolean }`: Fine-grained control
   *
   * Default: `{ horizontal: true, vertical: false }`
   */
  grid?: boolean | GridConfig;

  /* === Spacing Configuration === */

  /** Chart margin (outer spacing) */
  chartMargin?: ChartMargin;

  /** X-axis padding (inner spacing for axis) */
  xAxisPadding?: ChartPadding;

  /* === DOM === */

  /** Custom class name */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                           Re-exports                                       */
/* -------------------------------------------------------------------------- */

// Re-export shared types for convenience
export type { ChartDataPoint, ChartMargin, ChartPadding, LegendPosition, GridConfig };
