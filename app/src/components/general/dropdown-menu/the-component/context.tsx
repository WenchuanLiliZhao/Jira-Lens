/**
 * Dropdown Menu Context
 * 
 * Provides shared state and methods to all dropdown menu components
 */

import { createContext, useContext } from 'react';
import type { DropdownMenuContextValue } from './types';

// ============ CONTEXT ============

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

// ============ PROVIDER ============

export const DropdownMenuProvider = DropdownMenuContext.Provider;

// ============ HOOK ============

/**
 * Hook to access dropdown menu context
 * Throws error if used outside DropdownMenu
 */
export function useDropdownMenuContext(): DropdownMenuContextValue {
  const context = useContext(DropdownMenuContext);
  
  if (!context) {
    throw new Error(
      'useDropdownMenuContext must be used within a DropdownMenu component'
    );
  }
  
  return context;
}

/**
 * Hook to optionally access dropdown menu context
 * Returns null if used outside DropdownMenu (for nested menus)
 */
export function useOptionalDropdownMenuContext(): DropdownMenuContextValue | null {
  return useContext(DropdownMenuContext);
}
