/**
 * SwiperCarousel Component Types
 * 
 * Type definitions for the SwiperCarousel component wrapper around Swiper.js
 */

import React from 'react';

/**
 * Slide content can be either React nodes or data objects
 */
export type SlideContent = React.ReactNode | {
  /** Slide content as React node */
  content: React.ReactNode;
  /** Optional slide key for React reconciliation */
  key?: string | number;
};

/**
 * Autoplay configuration
 */
export interface AutoplayConfig {
  /** Delay between transitions (in ms) */
  delay?: number;
  /** Set to false to disable autoplay */
  disableOnInteraction?: boolean;
  /** When enabled autoplay will be paused on mouse enter over Swiper container */
  pauseOnMouseEnter?: boolean;
  /** When enabled autoplay will be stopped when it reaches last slide */
  stopOnLastSlide?: boolean;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Show pagination */
  enabled?: boolean;
  /** Pagination type: 'bullets' | 'fraction' | 'progressbar' | 'custom' */
  type?: 'bullets' | 'fraction' | 'progressbar';
  /** Make pagination clickable */
  clickable?: boolean;
  /** Custom pagination element class */
  bulletClass?: string;
  /** Custom active bullet class */
  bulletActiveClass?: string;
}

/**
 * Navigation configuration
 */
export interface NavigationConfig {
  /** Show navigation arrows */
  enabled?: boolean;
  /** Custom next button element class */
  nextEl?: string | HTMLElement | null;
  /** Custom prev button element class */
  prevEl?: string | HTMLElement | null;
  /** Hide navigation on last slide */
  hideOnClick?: boolean;
  /** Disable navigation on interaction */
  disabledClass?: string;
}

/**
 * SwiperCarousel component props
 */
export interface SwiperCarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 
   * Array of slide content.
   * Can be React nodes directly or objects with content and optional key.
   */
  slides: SlideContent[];
  
  /** 
   * Direction of slides: 'horizontal' | 'vertical'
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
  
  /** 
   * Number of slides per view (slides visible at the same time)
   * @default 1
   */
  slidesPerView?: number | 'auto';
  
  /** 
   * Space between slides (in px)
   * @default 0
   */
  spaceBetween?: number;
  
  /** 
   * Enable infinite loop mode
   * @default false
   */
  loop?: boolean;
  
  /** 
   * Autoplay configuration
   * Set to true for default autoplay, or provide configuration object
   */
  autoplay?: boolean | AutoplayConfig;
  
  /** 
   * Navigation arrows configuration
   * Set to true for default navigation, or provide configuration object
   */
  navigation?: boolean | NavigationConfig;
  
  /** 
   * Pagination dots/indicators configuration
   * Set to true for default pagination, or provide configuration object
   */
  pagination?: boolean | PaginationConfig;
  
  /** 
   * Responsive breakpoints configuration
   * Maps screen width (in px) to Swiper configuration
   */
  breakpoints?: {
    [width: number]: {
      slidesPerView?: number | 'auto';
      spaceBetween?: number;
      [key: string]: any;
    };
  };
  
  /** 
   * Callback fired when slide changes
   */
  onSlideChange?: (swiper: any) => void;
  
  /** 
   * Additional Swiper.js configuration options
   * See https://swiperjs.com/swiper-api for full list
   */
  swiperOptions?: Record<string, any>;
  
  /** 
   * Custom class name for the Swiper container
   */
  className?: string;
  
  /** 
   * Custom class name for individual slides
   */
  slideClassName?: string;
  
  /** 
   * Height of the carousel container
   * Can be a CSS value (e.g., '400px', '50vh')
   * @default 'auto'
   */
  height?: string | number;
}
