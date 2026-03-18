/**
 * ComboChart Component - Public API
 *
 * A flexible dual-axis combination chart supporting both column and line visualizations.
 */

export { ComboChart } from './the-component';
export type {
  ComboChartProps,
  ComboSeriesConfig,
  ComboColumnSeriesConfig,
  ComboLineSeriesConfig,
  LineDisplayMode,
  YAxisId,
  YAxisConfig,
} from './the-component';

// Re-export demo page
export { ComboChartDemoPage } from './__demo__/react';
