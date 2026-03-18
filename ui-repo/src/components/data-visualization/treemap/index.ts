/**
 * Treemap Component Exports
 *
 * This file exports the component, types, constants, and demo page.
 */

// Component
export { Treemap } from './the-component';

// Types
export type {
  TreemapProps,
  TreemapDataItem,
  TreemapInternalNode,
  TreemapContentProps,
} from './the-component';

// Constants
export {
  DEFAULT_DESIGN,
  DEFAULT_COLOR_SCHEME,
  CHART_COLORS,
  TYPOGRAPHY,
  OPACITY,
} from './the-component';
export type { ChartColorName } from './the-component';

// Demo Page
export { TreemapDemoPage } from './__demo__/react';
