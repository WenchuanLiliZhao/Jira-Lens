---
status:
  - done
  - redesign-needed
figma:
  - in-progress
created: 2026-02-04
updated: 2026-02-04
category: form
complexity: B
aliases:
  - Search
  - SearchBox
  - SearchBar
dependencies: []
externalDependencies:
  - react
  - react-router-dom
aiContext: |
  Search is a compound component system for building flexible search interfaces.
  Use <Search> as root provider, with <Search.Input>, <Search.Filters>, 
  <Search.Suggestions>, <Search.Results>, and <Search.Empty> as composable children.
  Supports debounced input, URL state sync via useSearchState, and three filter 
  trigger modes (live, per-filter, batch). UI is decoupled - arrange children freely.
---

# Search Component

## Quick Summary

Search is a **compound component system** following the "logic encapsulated, UI decoupled" architecture pattern. It provides a root context provider with composable sub-components that share search state while allowing complete layout flexibility. Built with Material Design 3 principles: Search Bar (persistent entry) and Search View (expanded state).

**AI Hint**: Use `<Search>` as the wrapper, then compose with `Search.Input`, `Search.Filters`, `Search.Suggestions`, `Search.Results`, `Search.Empty`. For URL persistence, use the `syncToUrl` prop or `useSearchState` hook.

---

## When to Use

✅ **DO use Search when:**
- Building search interfaces that need shared state between input, filters, and results
- You need URL-synchronized search parameters (shareable links, browser history)
- Implementing search with suggestions/autocomplete
- Building filterable lists with debounced search

❌ **DON'T use Search when:**
- Simple inline search on a single field → use `SearchInput` instead
- No need for filters or suggestions → use `SearchInput` instead
- Search is not the primary feature → consider a simple input with local state

---

## Compound Components

| Component | Purpose |
|-----------|---------|
| `<Search>` | Root provider - manages state context |
| `<Search.Input>` | Search input with debounce |
| `<Search.Filters>` | Container for filter controls |
| `<Search.Suggestions>` | Autocomplete/suggestion panel |
| `<Search.Results>` | Results rendering area (render props) |
| `<Search.Empty>` | Empty state when no results |

---

## Props API

### Search (Root)

```typescript
interface SearchProps {
  /** Callback when search is triggered */
  onSearch?: (query: string, filters: FilterState) => void;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
  /** Sync search state to URL */
  syncToUrl?: boolean;
  /** Initial query value */
  defaultQuery?: string;
  /** Initial filters */
  defaultFilters?: FilterState;
  /** Filter trigger mode */
  filterMode?: 'live' | 'per-filter' | 'batch';
  /** Loading state */
  loading?: boolean;
  children: React.ReactNode;
}
```

### Search.Input

```typescript
interface SearchInputProps {
  placeholder?: string;
  autoFocus?: boolean;
  /** Show clear button */
  clearable?: boolean;
  /** Leading icon (default: search icon) */
  leadingIcon?: React.ReactNode;
}
```

### Search.Filters

```typescript
interface SearchFiltersProps {
  children: React.ReactNode;
  /** Show apply button (for batch mode) */
  showApplyButton?: boolean;
}
```

### Search.Results

```typescript
interface SearchResultsProps<T> {
  /** Render function receiving search results */
  children: (results: T[], state: SearchState) => React.ReactNode;
}
```

---

## Quick Start

### Basic Usage

```tsx
<Search onSearch={handleSearch}>
  <Search.Input placeholder="Search products..." />
  <Search.Results>
    {(results) => results.map(item => (
      <ProductCard key={item.id} {...item} />
    ))}
  </Search.Results>
  <Search.Empty message="No products found" />
</Search>
```

### With Filters

```tsx
<Search onSearch={handleSearch} filterMode="live">
  <Search.Input placeholder="Search..." />
  <Search.Filters>
    <Select name="category" options={categories} />
    <DateRangePicker name="dateRange" />
  </Search.Filters>
  <Search.Results>
    {(results) => <DataTable data={results} />}
  </Search.Results>
</Search>
```

### With URL Sync

```tsx
<Search onSearch={handleSearch} syncToUrl>
  <Search.Input placeholder="Search..." />
  <Search.Results>
    {(results) => <ResultsList items={results} />}
  </Search.Results>
</Search>
```

---

## Hooks

### useSearch

Access search context from any child component:

```tsx
const { query, filters, setQuery, setFilters, search, loading } = useSearch();
```

### useSearchState

Standalone hook for URL-synced search state:

```tsx
const [searchParams, setSearchParams] = useSearchState({
  query: '',
  filters: {},
});
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

- `Search.Input`: `role="searchbox"`, `aria-label` for screen readers
- `Search.Suggestions`: `role="listbox"` with `aria-expanded`, `aria-controls`
- Keyboard navigation: Arrow keys for suggestions, Enter to select, Escape to close
- Focus trapping in expanded search view
- Clear button has proper `aria-label`
- Loading state announced via `aria-live` region

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.
