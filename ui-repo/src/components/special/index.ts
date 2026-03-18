/**
 * Special Components - Category Index
 * 
 * Auto-generated exports for category demo pages group.
 */

import type { DemoPagesGroup } from '../../types/react-demo-page-types';
import { IndexCardDemoPage } from './index-card';
import { PlaceholderFeatureDemoPage } from './placeholder-feature';

export const SpecialDemoPages: DemoPagesGroup = {
  yaml: {
    title: 'Special',
    slug: 'special',
    status: ['draft'],
    figma: [],
  },
  pages: {
    IndexCardDemoPage,
    PlaceholderFeatureDemoPage,
  },
};

// Component Exports
export { IndexCard } from './index-card';
export { PlaceholderFeature } from './placeholder-feature';

// Type Exports
export type { IndexCardProps } from './index-card';
export type { PlaceholderFeatureProps } from './placeholder-feature';
