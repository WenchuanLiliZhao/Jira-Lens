/**
 * BentoGrid Component Types
 * 
 * Type definitions for the BentoGrid component system.
 */

import React from 'react';

/* =============================================================================
 * Span Types
 * ========================================================================== */

/**
 * Valid column span values (1-12 columns or full width)
 */
export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';

/**
 * Valid row span values (1-6 rows)
 */
export type RowSpan = 1 | 2 | 3 | 4 | 5 | 6;

/* =============================================================================
 * Responsive Configuration Types
 * ========================================================================== */

/**
 * Responsive configuration for BentoGrid.Item
 * 
 * @example
 * ```tsx
 * // Item with responsive breakpoints
 * res={[
 *   { maxWidth: 640, cols: 4, rows: 2 },   // 0-640px
 *   { maxWidth: 1024, cols: 6, rows: 2 },  // 641-1024px
 *   { cols: 8, rows: 2 }                   // 1025px+ (default)
 * ]}
 * ```
 */
export interface ResponsiveConfig {
  /**
   * Maximum container width for this configuration.
   * When omitted, this becomes the default (largest) breakpoint.
   */
  maxWidth?: number;
  
  /** Number of columns to span (1-12 or 'full') */
  cols: ColSpan;
  
  /** Number of rows to span (1-6) */
  rows: RowSpan;
}

/**
 * Responsive row height configuration
 * 
 * @example
 * ```tsx
 * rowHeight={[
 *   { maxWidth: 640, height: 60 },
 *   { maxWidth: 1024, height: 80 },
 *   { height: 100 }  // default
 * ]}
 * ```
 */
export interface ResponsiveRowHeight {
  /**
   * Maximum container width for this configuration.
   * When omitted, this becomes the default (largest) breakpoint.
   */
  maxWidth?: number;
  
  /** Row height in pixels */
  height: number;
}

/* =============================================================================
 * Gap Types
 * ========================================================================== */

/**
 * Gap size variants
 */
export type GapSize = 'none' | 'sm' | 'md' | 'lg';

/* =============================================================================
 * Context Types
 * ========================================================================== */

/**
 * BentoGrid context value
 */
export interface BentoGridContextValue {
  /** Current container width in pixels, null if not yet measured */
  containerWidth: number | null;
}

/* =============================================================================
 * Component Props
 * ========================================================================== */

/**
 * Props for BentoGrid container component
 */
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grid items */
  children?: React.ReactNode;
  
  /**
   * Gap size between items
   * @default "md"
   */
  gap?: GapSize;
  
  /**
   * Responsive row height configuration.
   * Array of { maxWidth?, height } objects.
   * @default [{ height: 180 }]
   */
  rowHeight?: ResponsiveRowHeight[];
  
  /** Custom class name */
  className?: string;
}

/**
 * Props for BentoGrid.Item component
 */
export interface BentoGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Item content */
  children?: React.ReactNode;
  
  /**
   * Responsive configuration array.
   * Each object specifies { maxWidth?, cols, rows }.
   * Objects without maxWidth are treated as the default (largest) breakpoint.
   * 
   * @example
   * ```tsx
   * res={[
   *   { maxWidth: 640, cols: 4, rows: 2 },
   *   { maxWidth: 1024, cols: 6, rows: 2 },
   *   { cols: 8, rows: 2 }
   * ]}
   * ```
   */
  res: ResponsiveConfig[];
  
  /**
   * If true, renders the child as the root element using Radix UI Slot.
   * Enables polymorphic rendering (e.g., render as <a> or <button>).
   * @default false
   */
  asChild?: boolean;
  
  /** Custom class name */
  className?: string;
}
