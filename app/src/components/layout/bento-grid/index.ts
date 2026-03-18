/**
 * BentoGrid Component Exports
 * 
 * A flexible 12-column grid system with container-based responsive behavior.
 */

// Main component export (Compound Components pattern)
export { BentoGrid } from "./the-component";

// Type exports
export type {
  BentoGridProps,
  BentoGridItemProps,
  ResponsiveConfig,
  ResponsiveRowHeight,
  ColSpan,
  RowSpan,
  GapSize,
} from "./the-component";

// Context exports (for advanced use cases)
export { BentoGridContext, useBentoGridContext } from "./the-component";

// Demo page export