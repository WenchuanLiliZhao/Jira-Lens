/**
 * Dev Tools Components - Category Index
 * 
 * Auto-generated exports for category demo pages group.
 */

import type { DemoPagesGroup } from '../../types/react-demo-page-types';
import { ComponentDemoLayoutDemoPage } from './component-demo-layout';
import { DevToolbarDemoPage } from './dev-toolbar';
import { DevToolsFABDemoPage } from './dev-tools-fab';
import { PrdAnnotationDemoPage } from './prd-annotation';

export const DevToolsDemoPages: DemoPagesGroup = {
  yaml: {
    title: 'Dev Tools',
    slug: 'dev-tools',
    status: ['done', 'draft'],
    figma: [],
  },
  pages: {
    ComponentDemoLayoutDemoPage,
    DevToolbarDemoPage,
    DevToolsFABDemoPage,
    PrdAnnotationDemoPage,
  },
};

// Component Exports
export { ComponentDemoLayout } from './component-demo-layout';
export { DevToolbar } from './dev-toolbar';
export { DevToolsFAB } from './dev-tools-fab';
export { PrdAnnotation } from './prd-annotation';

// Type Exports
export type { ComponentDemoLayoutProps } from './component-demo-layout';
export type { DevToolbarProps } from './dev-toolbar';
export type { DevToolsFABProps } from './dev-tools-fab';
export type { PrdAnnotationProps } from './prd-annotation';
