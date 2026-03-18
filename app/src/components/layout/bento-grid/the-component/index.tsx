/**
 * BentoGrid Component System
 * 
 * A flexible 12-column grid system inspired by Bento Box layouts.
 * Uses Compound Components pattern for intuitive API.
 * 
 * @example
 * ```tsx
 * import { BentoGrid } from '@/components/layout/bento-grid';
 * 
 * <BentoGrid gap="md">
 *   <BentoGrid.Item res={[{ maxWidth: 640, cols: 4, rows: 2 }, { cols: 8, rows: 2 }]}>
 *     <Card>Content</Card>
 *   </BentoGrid.Item>
 * </BentoGrid>
 * ```
 */

import { BentoGridRoot } from './BentoGrid';
import { BentoGridItem } from './BentoGridItem';

/* =============================================================================
 * Compound Component Export
 * ========================================================================== */

/**
 * BentoGrid Component
 * 
 * A container-responsive 12-column grid system.
 * 
 * Sub-components:
 * - `BentoGrid.Item` - Grid item with responsive column/row spanning
 * 
 * @example
 * ```tsx
 * <BentoGrid gap="md" rowHeight={[{ maxWidth: 800, height: 60 }, { height: 80 }]}>
 *   <BentoGrid.Item res={[
 *     { maxWidth: 640, cols: 6, rows: 2 },
 *     { cols: 4, rows: 2 }
 *   ]}>
 *     <Card>Content</Card>
 *   </BentoGrid.Item>
 * </BentoGrid>
 * ```
 */
export const BentoGrid = Object.assign(BentoGridRoot, {
  /**
   * BentoGrid.Item - A responsive grid item
   */
  Item: BentoGridItem,
});

/* =============================================================================
 * Type Exports
 * ========================================================================== */

export type {
  BentoGridProps,
  BentoGridItemProps,
  ResponsiveConfig,
  ResponsiveRowHeight,
  ColSpan,
  RowSpan,
  GapSize,
} from './types';

/* =============================================================================
 * Context Export (for advanced use cases)
 * ========================================================================== */

export { BentoGridContext, useBentoGridContext } from './context';
