/**
 * Search Empty Component
 * 
 * Displays empty state when search returns no results.
 * Only renders when hasSearched is true and results are empty.
 */

import React from 'react';
import styles from './styles.module.scss';
import type { SearchEmptyProps } from './types';
import { useSearchContext } from './context';
import { Button } from '../../../general/button';

// Default empty icon
const EmpytIllustration: React.FC = () => (
  <img
    src="https://i.pinimg.com/1200x/88/12/3a/88123a5e33bbe508ca3ec569fdd76d4c.jpg"
    alt="Empty state"
    width={48}
    height={48}
  />
);

export const SearchEmpty: React.FC<SearchEmptyProps> = ({
  message = 'No results found',
  description,
  icon,
  action,
  children,
  className,
}) => {
  const { hasSearched, query, filters, clearAll } = useSearchContext();

  // Only show if search has been performed
  // The parent component should conditionally render this based on results
  if (!hasSearched) {
    return null;
  }

  // Build description with context if not provided
  const defaultDescription = query
    ? `No results found for "${query}". Try adjusting your search or filters.`
    : Object.keys(filters).length > 0
      ? 'No results match your current filters. Try clearing some filters.'
      : undefined;

  const displayDescription = description || defaultDescription;

  // Build className
  const emptyClassName = [
    styles['search-empty'],
    className,
  ].filter(Boolean).join(' ');

  // If custom children provided, render those
  if (children) {
    return (
      <div className={emptyClassName} role="status">
        {children}
      </div>
    );
  }

  return (
    <div className={emptyClassName} role="status">
      <div className={styles['search-empty__icon']}>
        {icon || <EmpytIllustration />}
      </div>

      <h3 className={styles['search-empty__message']}>
        {message}
      </h3>

      {displayDescription && (
        <p className={styles['search-empty__description']}>
          {displayDescription}
        </p>
      )}

      {action ? (
        <Button variant="outlined" color="secondary" onClick={clearAll}>
          {action}
        </Button>
      ) : (
        <Button variant="outlined" color="secondary" onClick={clearAll}>
          Clear search
        </Button>
      )}
    </div>
  );
};

SearchEmpty.displayName = 'Search.Empty';
