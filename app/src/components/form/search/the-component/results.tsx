/**
 * Search Results Component
 * 
 * Render prop component for displaying search results.
 * Provides search state to the render function for flexible rendering.
 */

import styles from './styles.module.scss';
import type { SearchResultsProps, SearchState } from './types';
import { useSearchContext } from './context';
import { Spinner } from '../../../feedback/spinner';

export function SearchResults<T>({
  data,
  children,
  className,
}: SearchResultsProps<T>) {
  const context = useSearchContext();

  // Build search state for render prop
  const searchState: SearchState = {
    query: context.query,
    filters: context.filters,
    loading: context.loading,
    hasSearched: context.hasSearched,
  };

  // Use provided data or empty array
  const results = (data || []) as T[];

  // Check if we should hide results (only after clearAll when everything is empty)
  const isCleared = !context.hasSearched && 
    !context.query && 
    Object.keys(context.filters).length === 0;

  // Build className
  const resultsClassName = [
    styles['search-results'],
    context.loading && styles['search-results--loading'],
    isCleared && styles['search-results--hidden'],
    className,
  ].filter(Boolean).join(' ');

  // Hide results only if cleared (not just initial state)
  if (isCleared) {
    return null;
  }

  return (
    <div 
      className={resultsClassName}
      aria-busy={context.loading}
      aria-live="polite"
    >
      {context.loading && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}>
          <Spinner size="medium" aria-label="Loading results" />
        </div>
      )}
      {children(results, searchState)}
    </div>
  );
}

SearchResults.displayName = 'Search.Results';
