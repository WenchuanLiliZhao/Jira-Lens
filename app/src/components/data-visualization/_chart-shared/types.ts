/**
 * Shared Chart Types
 *
 * Common type definitions used across chart components (TrendChart, ColumnChart, etc.)
 */

import React from 'react';

/* -------------------------------------------------------------------------- */
/*                              Data Types                                    */
/* -------------------------------------------------------------------------- */

/**
 * Represents a single data point in the chart.
 * The label is typically used for the X-axis.
 */
export interface ChartDataPoint {
  /** Label for the data point (typically X-axis value) */
  label: string;
  /** Dynamic key-value pairs for series data. Use null/undefined for missing/sparse data. */
  [key: string]: string | number | null | undefined;
}

/* -------------------------------------------------------------------------- */
/*                           Series Configuration                             */
/* -------------------------------------------------------------------------- */

/**
 * Base configuration for a data series.
 * Extended by specific chart types (TrendSeriesConfig, ColumnSeriesConfig).
 */
export interface BaseSeriesConfig {
  /** Data key in ChartDataPoint (e.g., "revenue", "users") */
  key: string;
  /** Display title for legend */
  title: string;
  /** Primary color for the series */
  color?: string;
  /** Material icon name for legend */
  icon?: string;
  /** Unit to display with values (e.g., "%", "pax", "$") */
  unit?: string;
}

/* -------------------------------------------------------------------------- */
/*                           Layout Configuration                             */
/* -------------------------------------------------------------------------- */

/**
 * Chart margin configuration (outer spacing).
 */
export interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

/**
 * Chart padding configuration (inner spacing, typically for axes).
 */
export interface ChartPadding {
  left?: number;
  right?: number;
}

/* -------------------------------------------------------------------------- */
/*                           Legend Configuration                             */
/* -------------------------------------------------------------------------- */

/**
 * Position of the legend relative to the chart.
 */
export type LegendPosition = 'top' | 'bottom';

/**
 * Props for the shared ChartLegend component.
 */
export interface ChartLegendProps {
  /** Series configuration array */
  items: Array<{
    key: string;
    title: string;
    color: string;
    icon?: string;
  }>;
  /** Position of the legend */
  position?: LegendPosition;
  /** Custom class name */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                           Tooltip Configuration                            */
/* -------------------------------------------------------------------------- */

/**
 * Payload item from Recharts tooltip.
 */
export interface TooltipPayloadItem {
  name: string;
  value: number;
  dataKey: string;
  color: string;
  payload: ChartDataPoint;
}

/**
 * Props for the shared ChartTooltip component.
 */
export interface ChartTooltipProps {
  /** Whether the tooltip is active */
  active?: boolean;
  /** Tooltip payload from Recharts */
  payload?: TooltipPayloadItem[];
  /** Current label (X-axis value) */
  label?: string;
  /** Series configuration for displaying units and icons */
  seriesConfig: BaseSeriesConfig[];
  /** Custom formatter for tooltip content */
  formatter?: (item: TooltipPayloadItem, config: BaseSeriesConfig | undefined) => React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                           Recharts Custom Dot Props                        */
/* -------------------------------------------------------------------------- */

/**
 * Props passed to custom dot component by Recharts.
 */
export interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: ChartDataPoint;
  index?: number;
  dataKey?: string;
}

/* -------------------------------------------------------------------------- */
/*                           Grid Configuration                               */
/* -------------------------------------------------------------------------- */

/**
 * Configuration for chart grid lines.
 * Inspired by Chart.js's declarative grid API for independent control
 * of horizontal and vertical grid lines.
 */
export interface GridConfig {
  /** Show horizontal grid lines at Y-axis tick positions. Default: true */
  horizontal?: boolean;
  /** Show vertical grid lines at X-axis tick positions. Default: false */
  vertical?: boolean;
}
