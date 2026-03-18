/**
 * Search Component Exports
 * 
 * This file exports the compound component, hooks, and types.
 */

// Component
export { Search } from "./the-component";

// Hooks
export { 
  useSearch, 
  useSearchContext, 
  useOptionalSearchContext,
  useSearchState,
  useDebouncedValue,
  useDebouncedCallback,
} from "./the-component/hooks-export";

// Types
export type { 
  SearchProps,
  SearchInputProps,
  SearchFiltersProps,
  SearchSuggestionsProps,
  SearchResultsProps,
  SearchEmptyProps,
  SearchState,
  SearchContextValue,
  FilterState,
  FilterValue,
  FilterMode,
  UseSearchStateOptions,
  UseSearchStateReturn,
} from "./the-component";

// Demo page
export { SearchDemoPage } from "./__demo__/react";
