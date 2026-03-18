/**
 * Chart Shared Module
 *
 * Common utilities, components, and types for chart components.
 */

// Types
export type {
  ChartDataPoint,
  BaseSeriesConfig,
  ChartMargin,
  ChartPadding,
  LegendPosition,
  ChartLegendProps,
  TooltipPayloadItem,
  ChartTooltipProps,
  CustomDotProps,
  GridConfig,
} from './types';

// Constants
export {
  DEFAULT_COLOR_SCHEME,
  CHART_COLORS,
  OPACITY,
  TYPOGRAPHY,
  SPACING,
  Y_AXIS,
  LEGEND,
  LINE_CHART,
  COLUMN_CHART,
  GRID,
  HOVER,
  FILL_OPACITY_BY_MODE,
  STROKE_WIDTH_BY_MODE,
} from './constants';

export type { ChartColorName, LineDisplayMode } from './constants';

// Formatters
export {
  formatCompact,
  formatComma,
  formatPercent,
  formatCurrency,
  formatDecimal,
  getFormatterByName,
} from './formatters';

export type { AxisNumberFormat } from './formatters';

// Styles - re-export for convenience
export { default as sharedChartStyles } from './styles.module.scss';

// Components
export { ChartTooltip } from './ChartTooltip';
export { ChartLegend } from './ChartLegend';
export { CustomGridRenderer } from './CustomGridRenderer';
export type { CustomGridRendererProps } from './CustomGridRenderer';