/**
 * Search Component Types
 * 
 * Type definitions for the Search compound component system.
 */

import React from 'react';

// ============ FILTER TYPES ============

/** Supported filter value types */
export type FilterValue = 
  | string 
  | number 
  | boolean 
  | string[] 
  | number[] 
  | [Date | null, Date | null]  // Date range
  | null;

/** Filter state object - key-value pairs */
export type FilterState = Record<string, FilterValue>;

/** Filter trigger mode */
export type FilterMode = 'live' | 'per-filter' | 'batch';

// ============ SEARCH STATE ============

export interface SearchState {
  /** Current search query */
  query: string;
  /** Current filter values */
  filters: FilterState;
  /** Whether search is in progress */
  loading: boolean;
  /** Whether search has been triggered at least once */
  hasSearched: boolean;
}

// ============ CONTEXT TYPES ============

export interface SearchContextValue extends SearchState {
  /** Update the search query */
  setQuery: (query: string) => void;
  /** Update a single filter */
  setFilter: (name: string, value: FilterValue) => void;
  /** Update multiple filters at once */
  setFilters: (filters: FilterState) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Clear query and filters */
  clearAll: () => void;
  /** Manually trigger search */
  search: () => void;
  /** Filter mode */
  filterMode: FilterMode;
  /** Debounce delay in ms */
  debounceMs: number;
  /** Reference to the search input container element (for positioning suggestions) */
  inputRef: React.RefObject<HTMLDivElement | null> | null;
  /** Register input ref to context */
  setInputRef: (ref: React.RefObject<HTMLDivElement | null>) => void;
}

// ============ COMPONENT PROPS ============

export interface SearchProps {
  /** Callback when search is triggered */
  onSearch?: (query: string, filters: FilterState) => void;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Sync search state to URL query params */
  syncToUrl?: boolean;
  /** URL param name for query (default: 'q') */
  queryParam?: string;
  /** Initial query value */
  defaultQuery?: string;
  /** Initial filter values */
  defaultFilters?: FilterState;
  /** Filter trigger mode */
  filterMode?: FilterMode;
  /** External loading state */
  loading?: boolean;
  /** Component children */
  children: React.ReactNode;
  /** Custom class name */
  className?: string;
}

export interface SearchInputProps {
  /** Placeholder text */
  placeholder?: string;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Show clear button when has value */
  clearable?: boolean;
  /** Leading icon (defaults to search icon) */
  leadingIcon?: React.ReactNode;
  /** Trailing icon/action */
  trailingIcon?: React.ReactNode;
  /** Input size */
  size?: 'small' | 'medium' | 'large';
  /** Custom class name */
  className?: string;
  /** Aria label for accessibility */
  'aria-label'?: string;
  /** Input id attribute (auto-generated if not provided) */
  id?: string;
  /** Input name attribute (for form submission) */
  name?: string;
}

export interface SearchFiltersProps {
  /** Filter form children */
  children: React.ReactNode;
  /** Show apply button (useful for batch mode) */
  showApplyButton?: boolean;
  /** Apply button text */
  applyButtonText?: string;
  /** Show clear all button */
  showClearButton?: boolean;
  /** Clear button text */
  clearButtonText?: string;
  /** Layout direction */
  layout?: 'horizontal' | 'vertical';
  /** Custom class name */
  className?: string;
}

export interface SearchSuggestionsProps<T = unknown> {
  /** Suggestion items */
  items?: T[];
  /** Render function for each suggestion */
  renderItem?: (item: T, index: number) => React.ReactNode;
  /** Callback when suggestion is selected */
  onSelect?: (item: T) => void;
  /** Show recent searches */
  showRecentSearches?: boolean;
  /** Recent search items */
  recentSearches?: string[];
  /** Header text */
  header?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Display order: 'recent-first' shows recent searches before suggestions, 'suggestions-first' shows suggestions first */
  order?: 'recent-first' | 'suggestions-first';
  /** Maximum number of suggestions to display (undefined = show all) */
  maxSuggestions?: number;
  /** Maximum number of recent searches to display (undefined = show all) */
  maxRecentSearches?: number;
  /** Custom class name */
  className?: string;
}

export interface SearchResultsProps<T = unknown> {
  /** Results data (if not using context) */
  data?: T[];
  /** Render function receiving results */
  children: (results: T[], state: SearchState) => React.ReactNode;
  /** Custom class name */
  className?: string;
}

export interface SearchEmptyProps {
  /** Empty state message */
  message?: string;
  /** Description text */
  description?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Action button */
  action?: React.ReactNode;
  /** Custom render */
  children?: React.ReactNode;
  /** Custom class name */
  className?: string;
}

// ============ HOOK TYPES ============

export interface UseSearchStateOptions {
  /** Initial query */
  defaultQuery?: string;
  /** Initial filters */
  defaultFilters?: FilterState;
  /** Sync to URL */
  syncToUrl?: boolean;
  /** Query param name */
  queryParam?: string;
}

export interface UseSearchStateReturn {
  /** Current query */
  query: string;
  /** Current filters */
  filters: FilterState;
  /** Set query */
  setQuery: (query: string) => void;
  /** Set single filter */
  setFilter: (name: string, value: FilterValue) => void;
  /** Set multiple filters */
  setFilters: (filters: FilterState) => void;
  /** Clear all */
  clearAll: () => void;
}
