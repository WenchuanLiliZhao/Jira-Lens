/**
 * BentoGrid Context
 * 
 * Provides container width to child BentoGrid.Item components.
 * This enables container-based responsive behavior.
 */

import React from 'react';
import type { BentoGridContextValue } from './types';

/**
 * Context for sharing container width with BentoGrid.Item components.
 * 
 * The BentoGrid container monitors its own width using ResizeObserver
 * and provides this value to all child items via this context.
 */
export const BentoGridContext = React.createContext<BentoGridContextValue>({
  containerWidth: null,
});

/**
 * Hook to access BentoGrid context
 * 
 * @returns The current container width from the parent BentoGrid
 * @throws Error if used outside of a BentoGrid
 */
export function useBentoGridContext(): BentoGridContextValue {
  const context = React.useContext(BentoGridContext);
  return context;
}
