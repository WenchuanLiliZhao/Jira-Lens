/**
 * BentoGrid Container Component
 * 
 * A flexible 12-column grid system inspired by Bento Box layouts.
 * Features responsive behavior based on container width (not viewport).
 */

import React from 'react';
import { clsx } from 'clsx';
import { BentoGridContext } from './context';
import { bentoGridVariants, getRowHeightStyle } from './style';
import type { BentoGridProps, ResponsiveRowHeight } from './types';

/* =============================================================================
 * Helper Functions
 * ========================================================================== */

/**
 * Sort responsive configurations by maxWidth (ascending).
 * Configs without maxWidth are placed at the end (default/largest breakpoint).
 */
function sortByMaxWidth<T extends { maxWidth?: number }>(configs: T[]): T[] {
  return [...configs].sort((a, b) => {
    const aVal = a.maxWidth ?? Number.MAX_SAFE_INTEGER;
    const bVal = b.maxWidth ?? Number.MAX_SAFE_INTEGER;
    return aVal - bVal;
  });
}

/**
 * Get row height based on container width and responsive configuration.
 */
function getResponsiveRowHeight(
  containerWidth: number | null,
  rowHeight?: ResponsiveRowHeight[]
): number {
  const defaultHeight = 180;

  if (!rowHeight || rowHeight.length === 0) {
    return defaultHeight;
  }

  const sorted = sortByMaxWidth(rowHeight);

  // If width not yet measured, use first config
  if (containerWidth === null) {
    return sorted[0].height;
  }

  // Find matching breakpoint
  for (const config of sorted) {
    const breakpoint = config.maxWidth ?? Number.MAX_SAFE_INTEGER;
    if (containerWidth <= breakpoint) {
      return config.height;
    }
  }

  // Fallback to last config
  return sorted[sorted.length - 1].height;
}

/* =============================================================================
 * BentoGrid Component
 * ========================================================================== */

/**
 * BentoGrid Container Component
 * 
 * Creates a 12-column grid system that:
 * - Monitors its own width using ResizeObserver
 * - Provides width to child items via Context
 * - Supports responsive row height configuration
 * 
 * @example
 * ```tsx
 * <BentoGrid gap="md" rowHeight={[{ maxWidth: 800, height: 60 }, { height: 80 }]}>
 *   <BentoGrid.Item res={[{ maxWidth: 640, cols: 4, rows: 2 }, { cols: 8, rows: 2 }]}>
 *     <Card>Content</Card>
 *   </BentoGrid.Item>
 * </BentoGrid>
 * ```
 */
export const BentoGridRoot = React.forwardRef<HTMLDivElement, BentoGridProps>(
  (
    {
      children,
      className,
      gap = 'md',
      rowHeight,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = React.useState<number | null>(null);

    // Combine forwarded ref with internal ref
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

    // Monitor container width using ResizeObserver
    React.useEffect(() => {
      const element = containerRef.current;
      if (!element) return;

      const updateWidth = () => {
        setContainerWidth(element.offsetWidth);
      };

      // Initial measurement
      updateWidth();

      const resizeObserver = new ResizeObserver(() => {
        updateWidth();
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Build final className
    const finalClassName = clsx(
      bentoGridVariants({ gap }),
      className
    );

    // Calculate responsive row height
    const currentRowHeight = getResponsiveRowHeight(containerWidth, rowHeight);

    // Build inline styles
    const inlineStyle: React.CSSProperties = {
      gridAutoRows: getRowHeightStyle(currentRowHeight),
      ...style,
    };

    // Context value
    const contextValue = React.useMemo(
      () => ({ containerWidth }),
      [containerWidth]
    );

    return (
      <BentoGridContext.Provider value={contextValue}>
        <div
          ref={containerRef}
          className={finalClassName}
          style={inlineStyle}
          {...props}
        >
          {children}
        </div>
      </BentoGridContext.Provider>
    );
  }
);

BentoGridRoot.displayName = 'BentoGrid';
