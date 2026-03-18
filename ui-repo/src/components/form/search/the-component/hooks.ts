/**
 * Search Hooks
 * 
 * Custom hooks for search functionality including debouncing and URL state sync.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { 
  FilterState, 
  FilterValue, 
  UseSearchStateOptions, 
  UseSearchStateReturn 
} from './types';

/**
 * Custom useSearchParams replacement (no react-router).
 * Uses native History API for URL state sync.
 */
function useSearchParams(): [
  URLSearchParams,
  (v: URLSearchParams | ((p: URLSearchParams) => URLSearchParams), opts?: { replace?: boolean }) => void
] {
  const [params, setParams] = useState(
    () => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  );
  const setter = useCallback(
    (
      v: URLSearchParams | ((p: URLSearchParams) => URLSearchParams),
      opts?: { replace?: boolean }
    ) => {
      setParams((prev) => {
        const next = typeof v === 'function' ? v(prev) : v;
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.search = next.toString();
          (opts?.replace ? history.replaceState : history.pushState)({}, '', url.toString());
        }
        return next;
      });
    },
    []
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  return [params, setter];
}

// ============ DEBOUNCE HOOK ============

/**
 * Hook that returns a debounced version of a callback
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref on each render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;

  return debouncedCallback;
}

/**
 * Hook that returns a debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============ URL STATE SERIALIZATION ============

/**
 * Serialize filter value to URL-safe string
 */
function serializeFilterValue(value: FilterValue): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    // Handle date range
    if (value.length === 2 && (value[0] instanceof Date || value[0] === null)) {
      const [start, end] = value as [Date | null, Date | null];
      return `${start?.toISOString() || ''},${end?.toISOString() || ''}`;
    }
    // Handle string/number arrays
    return value.join(',');
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return String(value);
}

/**
 * Deserialize URL string to filter value
 * Note: Type inference is limited, consumers may need to cast
 */
function deserializeFilterValue(value: string): FilterValue {
  if (!value) return null;
  
  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  // Array (comma-separated)
  if (value.includes(',')) {
    const parts = value.split(',');
    // Check if it looks like a date range
    if (parts.length === 2 && (parts[0].includes('T') || parts[1].includes('T'))) {
      const start = parts[0] ? new Date(parts[0]) : null;
      const end = parts[1] ? new Date(parts[1]) : null;
      if ((start === null || !isNaN(start.getTime())) && 
          (end === null || !isNaN(end.getTime()))) {
        return [start, end];
      }
    }
    // Check if all parts are numbers
    const numParts = parts.map(p => Number(p));
    if (numParts.every(n => !isNaN(n))) {
      return numParts;
    }
    return parts;
  }
  
  // Number
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== '') {
    return num;
  }
  
  // String
  return value;
}

// ============ URL SEARCH STATE HOOK ============

/**
 * Hook for managing search state with optional URL synchronization
 * 
 * @example
 * ```tsx
 * const { query, filters, setQuery, setFilter } = useSearchState({
 *   syncToUrl: true,
 *   defaultQuery: '',
 * });
 * ```
 */
export function useSearchState(options: UseSearchStateOptions = {}): UseSearchStateReturn {
  const {
    defaultQuery = '',
    defaultFilters = {},
    syncToUrl = false,
    queryParam = 'q',
  } = options;

  // URL search params (only used if syncToUrl is true)
  const [searchParams, setSearchParams] = useSearchParams();

  // Internal state (used when not syncing to URL)
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const [internalFilters, setInternalFilters] = useState<FilterState>(defaultFilters);

  // Get current query
  const query = useMemo(() => {
    if (syncToUrl) {
      return searchParams.get(queryParam) || defaultQuery;
    }
    return internalQuery;
  }, [syncToUrl, searchParams, queryParam, defaultQuery, internalQuery]);

  // Get current filters from URL
  const filters = useMemo(() => {
    if (syncToUrl) {
      const result: FilterState = { ...defaultFilters };
      searchParams.forEach((value, key) => {
        if (key !== queryParam) {
          result[key] = deserializeFilterValue(value);
        }
      });
      return result;
    }
    return internalFilters;
  }, [syncToUrl, searchParams, queryParam, defaultFilters, internalFilters]);

  // Set query
  const setQuery = useCallback((newQuery: string) => {
    if (syncToUrl) {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        if (newQuery) {
          params.set(queryParam, newQuery);
        } else {
          params.delete(queryParam);
        }
        return params;
      }, { replace: true });
    } else {
      setInternalQuery(newQuery);
    }
  }, [syncToUrl, setSearchParams, queryParam]);

  // Set single filter
  const setFilter = useCallback((name: string, value: FilterValue) => {
    if (syncToUrl) {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        const serialized = serializeFilterValue(value);
        if (serialized) {
          params.set(name, serialized);
        } else {
          params.delete(name);
        }
        return params;
      }, { replace: true });
    } else {
      setInternalFilters(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }, [syncToUrl, setSearchParams]);

  // Set multiple filters
  const setFilters = useCallback((newFilters: FilterState) => {
    if (syncToUrl) {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        // Keep query param
        const currentQuery = params.get(queryParam);
        // Clear existing filter params
        const keysToDelete: string[] = [];
        params.forEach((_, key) => {
          if (key !== queryParam) keysToDelete.push(key);
        });
        keysToDelete.forEach(key => params.delete(key));
        // Add new filter params
        Object.entries(newFilters).forEach(([key, value]) => {
          const serialized = serializeFilterValue(value);
          if (serialized) {
            params.set(key, serialized);
          }
        });
        // Restore query param
        if (currentQuery) {
          params.set(queryParam, currentQuery);
        }
        return params;
      }, { replace: true });
    } else {
      setInternalFilters(newFilters);
    }
  }, [syncToUrl, setSearchParams, queryParam]);

  // Clear all
  const clearAll = useCallback(() => {
    if (syncToUrl) {
      setSearchParams(new URLSearchParams(), { replace: true });
    } else {
      setInternalQuery(defaultQuery);
      setInternalFilters(defaultFilters);
    }
  }, [syncToUrl, setSearchParams, defaultQuery, defaultFilters]);

  return {
    query,
    filters,
    setQuery,
    setFilter,
    setFilters,
    clearAll,
  };
}
