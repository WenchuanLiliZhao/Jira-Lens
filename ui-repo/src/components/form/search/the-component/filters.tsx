/**
 * Search Filters Component
 * 
 * Container for filter controls with support for batch apply mode.
 */

import React, { useCallback } from 'react';
import styles from './styles.module.scss';
import type { SearchFiltersProps } from './types';
import { useSearchContext } from './context';
import { Button } from '../../../general/button';

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  children,
  showApplyButton,
  applyButtonText = 'Apply',
  showClearButton = true,
  clearButtonText = 'Clear',
  layout = 'horizontal',
  className,
}) => {
  const { search, clearFilters, filterMode, filters } = useSearchContext();

  // Determine if we should show apply button
  // Default: show in batch mode, hide in live mode
  const shouldShowApply = showApplyButton ?? filterMode === 'batch';

  // Check if there are any active filters
  const hasActiveFilters = Object.values(filters).some(
    v => v !== null && v !== undefined && v !== '' &&
      !(Array.isArray(v) && v.length === 0)
  );

  // Handle apply button click
  const handleApply = useCallback(() => {
    search();
  }, [search]);

  // Handle clear button click
  const handleClear = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  // Build className
  const filtersClassName = [
    styles['search-filters'],
    styles[`search-filters--${layout}`],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={filtersClassName} role="group" aria-label="Search filters">
      <div className={styles['search-filters__content']}>
        {children}
      </div>

      {(shouldShowApply || (showClearButton && hasActiveFilters)) && (
        <div className={styles['search-filters__actions']}>
          {showClearButton && hasActiveFilters && (
            // use Button component
            <Button variant="contained" color="primary" onClick={handleClear}>
              {clearButtonText}
            </Button>
          )}

          {shouldShowApply && (
            <Button variant="contained" color="primary" onClick={handleApply}>
              {applyButtonText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

SearchFilters.displayName = 'Search.Filters';
