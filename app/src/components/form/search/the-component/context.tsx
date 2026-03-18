/**
 * Search Context
 * 
 * Provides shared state and methods to all Search compound components.
 * Follows the compound component pattern used by dropdown-menu.
 */

import { createContext, useContext } from 'react';
import type { SearchContextValue } from './types';

// ============ CONTEXT ============

const SearchContext = createContext<SearchContextValue | null>(null);

// ============ PROVIDER ============

export const SearchProvider = SearchContext.Provider;

// ============ HOOKS ============

/**
 * Hook to access search context
 * Throws error if used outside Search
 */
export function useSearchContext(): SearchContextValue {
  const context = useContext(SearchContext);
  
  if (!context) {
    throw new Error(
      'useSearchContext must be used within a Search component. ' +
      'Wrap your component tree with <Search>.'
    );
  }
  
  return context;
}

/**
 * Hook to optionally access search context
 * Returns null if used outside Search (for flexible usage)
 */
export function useOptionalSearchContext(): SearchContextValue | null {
  return useContext(SearchContext);
}

/**
 * Public hook for consumers to access search state and actions
 * This is the recommended way to access search functionality
 */
export function useSearch(): SearchContextValue {
  return useSearchContext();
}
