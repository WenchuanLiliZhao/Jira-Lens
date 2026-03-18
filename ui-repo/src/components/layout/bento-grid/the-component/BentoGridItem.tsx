/**
 * BentoGrid Item Component
 * 
 * A responsive grid item that adjusts its column and row span
 * based on the parent BentoGrid's container width.
 */

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { useBentoGridContext } from './context';
import { bentoItemVariants } from './style';
import type { BentoGridItemProps, ResponsiveConfig, ColSpan, RowSpan } from './types';

/* =============================================================================
 * Helper Functions
 * ========================================================================== */

/**
 * Sort responsive configurations by maxWidth (ascending).
 * Configs without maxWidth are placed at the end (default/largest breakpoint).
 */
function sortByMaxWidth(configs: ResponsiveConfig[]): ResponsiveConfig[] {
  return [...configs].sort((a, b) => {
    const aVal = a.maxWidth ?? Number.MAX_SAFE_INTEGER;
    const bVal = b.maxWidth ?? Number.MAX_SAFE_INTEGER;
    return aVal - bVal;
  });
}

/**
 * Validate and clamp colSpan to valid range
 */
function validateColSpan(value: ColSpan): ColSpan {
  if (value === 'full') return 'full';
  if (typeof value === 'number' && value >= 1 && value <= 12) return value;
  if (typeof value === 'number' && value < 1) return 1;
  return 12;
}

/**
 * Validate and clamp rowSpan to valid range
 */
function validateRowSpan(value: RowSpan): RowSpan {
  if (typeof value === 'number' && value >= 1 && value <= 6) return value;
  if (typeof value === 'number' && value < 1) return 1;
  return 6;
}

/**
 * Get colSpan and rowSpan based on container width and responsive config.
 */
function getResponsiveSpans(
  containerWidth: number | null,
  sortedConfigs: ResponsiveConfig[]
): { colSpan: ColSpan; rowSpan: RowSpan } {
  if (sortedConfigs.length === 0) {
    return { colSpan: 1, rowSpan: 1 };
  }

  // If width not yet measured, use first config
  if (containerWidth === null) {
    return {
      colSpan: validateColSpan(sortedConfigs[0].cols),
      rowSpan: validateRowSpan(sortedConfigs[0].rows),
    };
  }

  // Find matching breakpoint
  for (const config of sortedConfigs) {
    const breakpoint = config.maxWidth ?? Number.MAX_SAFE_INTEGER;
    if (containerWidth <= breakpoint) {
      return {
        colSpan: validateColSpan(config.cols),
        rowSpan: validateRowSpan(config.rows),
      };
    }
  }

  // Fallback to last config
  const last = sortedConfigs[sortedConfigs.length - 1];
  return {
    colSpan: validateColSpan(last.cols),
    rowSpan: validateRowSpan(last.rows),
  };
}

/* =============================================================================
 * BentoGridItem Component
 * ========================================================================== */

/**
 * BentoGrid.Item Component
 * 
 * A grid item that responds to the parent BentoGrid's container width.
 * Supports polymorphic rendering via the `asChild` prop.
 * 
 * @example
 * ```tsx
 * // Basic item with responsive breakpoints
 * <BentoGrid.Item res={[
 *   { maxWidth: 640, cols: 6, rows: 2 },
 *   { maxWidth: 1024, cols: 4, rows: 2 },
 *   { cols: 3, rows: 2 }
 * ]}>
 *   <Card>Content</Card>
 * </BentoGrid.Item>
 * 
 * // Polymorphic rendering as a link
 * <BentoGrid.Item res={[{ cols: 4, rows: 1 }]} asChild>
 *   <a href="/feature">Link Item</a>
 * </BentoGrid.Item>
 * ```
 */
export const BentoGridItem = React.forwardRef<HTMLDivElement, BentoGridItemProps>(
  ({ children, className, res, asChild = false, ...props }, ref) => {
    const { containerWidth } = useBentoGridContext();

    // Memoize sorted configs to avoid re-sorting on every render
    const sortedConfigs = React.useMemo(
      () => sortByMaxWidth(res),
      [res]
    );

    // Get responsive spans based on container width
    const { colSpan, rowSpan } = React.useMemo(
      () => getResponsiveSpans(containerWidth, sortedConfigs),
      [containerWidth, sortedConfigs]
    );

    // Use Slot for polymorphic rendering
    const Comp = asChild ? Slot : 'div';

    // Build final className
    const finalClassName = clsx(
      bentoItemVariants({ colSpan, rowSpan }),
      className
    );

    return (
      <Comp ref={ref} className={finalClassName} {...props}>
        {children}
      </Comp>
    );
  }
);

BentoGridItem.displayName = 'BentoGrid.Item';
