/**
 * Search Component - Main Export
 * 
 * A compound component system for building flexible search interfaces.
 * Follows the "logic encapsulated, UI decoupled" architecture pattern.
 * 
 * Usage:
 * ```tsx
 * <Search onSearch={handleSearch}>
 *   <Search.Input placeholder="Search..." />
 *   <Search.Filters>
 *     <Select name="category" options={options} />
 *   </Search.Filters>
 *   <Search.Suggestions items={suggestions} />
 *   <Search.Results>
 *     {(results) => results.map(item => <Card key={item.id} {...item} />)}
 *   </Search.Results>
 *   <Search.Empty message="No results found" />
 * </Search>
 * ```
 */

import { Search as SearchRoot } from './Component';
import { SearchInput } from './input';
import { SearchFilters } from './filters';
import { SearchSuggestions } from './suggestions';
import { SearchResults } from './results';
import { SearchEmpty } from './empty';

// ============ COMPOUND COMPONENT ============

export const Search = Object.assign(SearchRoot, {
  Input: SearchInput,
  Filters: SearchFilters,
  Suggestions: SearchSuggestions,
  Results: SearchResults,
  Empty: SearchEmpty,
});

// ============ HOOK EXPORTS ============
// Hooks are exported from './hooks-export' to comply with Fast Refresh requirements

// ============ TYPE EXPORTS ============

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
} from './types';
