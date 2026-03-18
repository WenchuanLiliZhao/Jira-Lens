/**
 * Search Component - Root Provider
 *
 * The main Search component that provides context to all child components.
 * Manages search state, debouncing, and optional URL synchronization.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import styles from './styles.module.scss';
import type { SearchProps, FilterState, FilterValue, SearchContextValue, FilterMode } from './types';
import { SearchProvider } from './context';
import { useDebouncedCallback, useSearchState } from './hooks';

export const Search = React.forwardRef<HTMLDivElement, SearchProps>(
  (props, ref) => {
    const {
      children,
      onSearch,
      debounceMs = 300,
      syncToUrl = false,
      queryParam = 'q',
      defaultQuery = '',
      defaultFilters = {},
      filterMode = 'live',
      loading: externalLoading = false,
      className,
      ...restProps
    } = props;

    // Use URL-synced state or internal state
    const {
      query,
      filters,
      setQuery: setStateQuery,
      setFilter: setStateFilter,
      setFilters: setStateFilters,
      clearAll: clearStateAll,
    } = useSearchState({
      defaultQuery,
      defaultFilters,
      syncToUrl,
      queryParam,
    });

    // Track if search has been triggered
    const [hasSearched, setHasSearched] = useState(false);

    // Internal loading state (for when we trigger search)
    const [internalLoading, setInternalLoading] = useState(false);

    // Input ref for positioning suggestions dropdown
    const [inputRef, setInputRefState] = useState<React.RefObject<HTMLDivElement | null> | null>(null);

    // Callback for SearchInput to register its container ref
    const setInputRef = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
      setInputRefState(ref);
    }, []);

    // Combined loading state
    const loading = externalLoading || internalLoading;

    // Search execution
    const executeSearch = useCallback(() => {
      if (onSearch) {
        setInternalLoading(true);
        setHasSearched(true);
        // Simulate async - in real usage, onSearch would handle this
        onSearch(query, filters);
        // Reset internal loading after a tick (external loading should take over)
        setTimeout(() => setInternalLoading(false), 0);
      }
    }, [onSearch, query, filters]);

    // Debounced search for live mode
    const debouncedSearch = useDebouncedCallback(executeSearch, debounceMs);

    // Set query (no auto-search, handled by useEffect in live mode)
    const setQuery = useCallback((newQuery: string) => {
      setStateQuery(newQuery);
    }, [setStateQuery]);

    // Set filter (no auto-search, handled by useEffect in live mode)
    const setFilter = useCallback((name: string, value: FilterValue) => {
      setStateFilter(name, value);
    }, [setStateFilter]);

    // Set multiple filters (no auto-search, handled by useEffect in live mode)
    const setFilters = useCallback((newFilters: FilterState) => {
      setStateFilters(newFilters);
    }, [setStateFilters]);

    // Clear filters only (no auto-search, handled by useEffect in live mode)
    const clearFilters = useCallback(() => {
      setStateFilters({});
    }, [setStateFilters]);

    // Clear everything
    const clearAll = useCallback(() => {
      clearStateAll();
      setHasSearched(false);
    }, [clearStateAll]);

    // Manual search trigger (for batch mode or explicit search)
    const search = useCallback(() => {
      executeSearch();
    }, [executeSearch]);

    // Track if this is the initial mount
    const isInitialMount = React.useRef(true);

    // Auto-search on initial mount if there's a default query or URL params
    useEffect(() => {
      if ((query || Object.keys(filters).length > 0) && !hasSearched) {
        executeSearch();
      }
      isInitialMount.current = false;
      // Only run on mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-search in live mode when query or filters change
    useEffect(() => {
      // Skip on initial mount (handled by the effect above)
      if (isInitialMount.current) {
        return;
      }
      
      if (filterMode === 'live' && onSearch) {
        debouncedSearch();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, filters, filterMode, onSearch]);

    // Context value
    const contextValue: SearchContextValue = useMemo(() => ({
      query,
      filters,
      loading,
      hasSearched,
      setQuery,
      setFilter,
      setFilters,
      clearFilters,
      clearAll,
      search,
      filterMode: filterMode as FilterMode,
      debounceMs,
      inputRef,
      setInputRef,
    }), [
      query,
      filters,
      loading,
      hasSearched,
      setQuery,
      setFilter,
      setFilters,
      clearFilters,
      clearAll,
      search,
      filterMode,
      debounceMs,
      inputRef,
      setInputRef,
    ]);

    // Build className
    const componentClassName = [
      styles.search,
      className,
    ].filter(Boolean).join(' ');

    return (
      <SearchProvider value={contextValue}>
        <div
          ref={ref}
          className={componentClassName}
          data-loading={loading}
          role="search"
          {...restProps}
        >
          {children}
        </div>
      </SearchProvider>
    );
  }
);

Search.displayName = 'Search';
