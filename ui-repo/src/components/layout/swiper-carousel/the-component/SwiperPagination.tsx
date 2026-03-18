/**
 * SwiperPagination Component
 * 
 * A standalone pagination component for Swiper carousel.
 * Can be used independently for debugging and styling.
 * 
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 */

import React from 'react';
import { Pagination } from 'swiper/modules';
import styles from './SwiperPagination.module.scss';
import type { PaginationConfig } from './types';

export interface SwiperPaginationProps {
  /** Pagination configuration */
  pagination: boolean | PaginationConfig;
  
  /** Direction of the carousel */
  direction: 'horizontal' | 'vertical';
  
  /** Custom class name */
  className?: string;
}

/**
 * SwiperPagination Component
 * 
 * Renders pagination for Swiper carousel with proper styling
 * based on direction (horizontal/vertical).
 * 
 * This component renders a div with class "swiper-pagination" that Swiper
 * will automatically find and use for pagination.
 */
export const SwiperPagination = React.forwardRef<HTMLDivElement, SwiperPaginationProps>(
  ({ pagination, direction, className }, ref) => {
    // If pagination is disabled, don't render anything
    if (!pagination) {
      return null;
    }

    // Build className with direction modifier
    const paginationClassName = [
      styles['swiper-pagination-wrapper'],
      styles[`swiper-pagination-wrapper-${direction}`],
      className,
    ].filter(Boolean).join(' ');

    // Determine pagination type
    const paginationType = typeof pagination === 'boolean'
      ? 'bullets'
      : (pagination.type ?? 'bullets');

    return (
      <div
        ref={ref}
        className={`swiper-pagination ${paginationClassName}`}
        data-direction={direction}
        data-pagination-type={paginationType}
        data-swiper-pagination
      />
    );
  }
);

SwiperPagination.displayName = 'SwiperPagination';

// Export Pagination module for use in Swiper
export { Pagination };
