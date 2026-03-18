/**
 * Layout Components - Category Index
 * 
 * Auto-generated exports for category demo pages group.
 */

import type { DemoPagesGroup } from '../../types/react-demo-page-types';
import { BasicLayoutDemoPage } from './basic-layout';
import { BentoGridDemoPage } from './bento-grid';
import { SwiperCarouselDemoPage } from './swiper-carousel';

export const LayoutDemoPages: DemoPagesGroup = {
  yaml: {
    title: 'Layout',
    slug: 'layout',
    status: ['done', 'in-progress'],
    figma: ['draft'],
  },
  pages: {
    BasicLayoutDemoPage,
    BentoGridDemoPage,
    SwiperCarouselDemoPage,
  },
};

// Component Exports
export { BasicLayout } from './basic-layout';
export { BentoGrid } from './bento-grid';
export { SwiperCarousel } from './swiper-carousel';

// Type Exports
export type { BasicLayoutProps } from './basic-layout';
export type { BentoGridProps } from './bento-grid';
export type { SwiperCarouselProps } from './swiper-carousel';
