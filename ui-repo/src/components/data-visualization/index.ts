/**
 * Data Visualization Components - Category Index
 * 
 * Auto-generated exports for category demo pages group.
 */

import type { DemoPagesGroup } from '../../types/react-demo-page-types';
import { AmapMapDemoPage } from './amap';
import { ChartDemoPage } from './chart';
import { ComboChartDemoPage } from './combo-chart';
import { DistributionBarDemoPage } from './distribution-bar';
import { PieChartDemoPage } from './pie-chart';
import { ScoreGaugeDemoPage } from './score-gauge';
import { TreemapDemoPage } from './treemap';

export const DataVisualizationDemoPages: DemoPagesGroup = {
  yaml: {
    title: 'Data Visualization',
    slug: 'data-visualization',
    status: ['done', 'draft', 'known-bug'],
    figma: [],
  },
  pages: {
    AmapMapDemoPage,
    ChartDemoPage,
    ComboChartDemoPage,
    DistributionBarDemoPage,
    PieChartDemoPage,
    ScoreGaugeDemoPage,
    TreemapDemoPage,
  },
};

// Component Exports
export { AmapMap } from './amap';
export { AmapStyleDebugPanel } from './amap';
export { Chart } from './chart';
export { ComboChart } from './combo-chart';
export { DistributionBar } from './distribution-bar';
export { PieChart } from './pie-chart';
export { ScoreGauge } from './score-gauge';
export { Treemap } from './treemap';

// Type Exports
export type { AmapMapProps } from './amap';
export type { AmapStyleDebugPanelProps } from './amap';
export type { ChartProps } from './chart';
export type { ComboChartProps } from './combo-chart';
export type { DistributionBarProps } from './distribution-bar';
export type { PieChartProps } from './pie-chart';
export type { ScoreGaugeProps } from './score-gauge';
export type { TreemapProps } from './treemap';
