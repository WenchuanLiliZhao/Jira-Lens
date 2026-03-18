/**
 * Data Display Components - Category Index
 * 
 * Auto-generated exports for category demo pages group.
 */

import type { DemoPagesGroup } from '../../types/react-demo-page-types';
import { DataTableDemoPage } from './data-table';
import { FeedbackCardDemoPage } from './feedback-card';
import { StatCardDemoPage } from './stat-card';

export const DataDisplayDemoPages: DemoPagesGroup = {
  yaml: {
    title: 'Data Display',
    slug: 'data-display',
    status: ['done', 'draft'],
    figma: [],
  },
  pages: {
    DataTableDemoPage,
    FeedbackCardDemoPage,
    StatCardDemoPage,
  },
};

// Component Exports
export { DataTable } from './data-table';
export { FeedbackCard } from './feedback-card';
export { StatCard } from './stat-card';

// Type Exports
export type { DataTableProps } from './data-table';
export type { FeedbackCardProps } from './feedback-card';
export type { StatCardProps } from './stat-card';
