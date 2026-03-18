/**
 * BentoGrid Style Configuration using CVA
 * 
 * Defines variants for the BentoGrid component system using class-variance-authority.
 */

import { cva, type VariantProps } from 'class-variance-authority';
import styles from './styles.module.scss';

/* =============================================================================
 * BentoGrid Container Variants
 * ========================================================================== */

/**
 * CVA configuration for BentoGrid container
 */
export const bentoGridVariants = cva(
  styles.grid,
  {
    variants: {
      gap: {
        none: styles['gap-none'],
        sm: styles['gap-sm'],
        md: styles['gap-md'],
        lg: styles['gap-lg'],
      },
    },
    defaultVariants: {
      gap: 'md',
    },
  }
);

export type BentoGridVariantsProps = VariantProps<typeof bentoGridVariants>;

/* =============================================================================
 * BentoGrid Item Variants
 * ========================================================================== */

/**
 * CVA configuration for BentoGrid.Item
 */
export const bentoItemVariants = cva(
  styles.item,
  {
    variants: {
      colSpan: {
        1: styles['col-span-1'],
        2: styles['col-span-2'],
        3: styles['col-span-3'],
        4: styles['col-span-4'],
        5: styles['col-span-5'],
        6: styles['col-span-6'],
        7: styles['col-span-7'],
        8: styles['col-span-8'],
        9: styles['col-span-9'],
        10: styles['col-span-10'],
        11: styles['col-span-11'],
        12: styles['col-span-12'],
        full: styles['col-span-full'],
      },
      rowSpan: {
        1: styles['row-span-1'],
        2: styles['row-span-2'],
        3: styles['row-span-3'],
        4: styles['row-span-4'],
        5: styles['row-span-5'],
        6: styles['row-span-6'],
      },
    },
    defaultVariants: {
      colSpan: 1,
      rowSpan: 1,
    },
  }
);

export type BentoItemVariantsProps = VariantProps<typeof bentoItemVariants>;

/* =============================================================================
 * Helper Functions
 * ========================================================================== */

/**
 * Generate CSS value for grid-auto-rows
 * 
 * @param height - Row height in pixels
 * @returns CSS value string for grid-auto-rows
 */
export function getRowHeightStyle(height: number): string {
  return `minmax(${height}px, auto)`;
}
