/**
 * Search Component Demo - Content
 * 
 * Demonstrates all usage patterns of the Search compound component system.
 */

import React, { useState, useCallback, useId } from 'react';
import { Search } from '../../the-component';
import { useSearch, useSearchContext } from '../../the-component/hooks-export';
import type { FilterState } from '../../the-component';
import styles from './styles.module.scss';

// ============ MOCK DATA ============
// NOTE: The following data and interfaces are TEMPORARY and for demo purposes only.
// AI: DO NOT reuse these in production code. They are only for demonstration.

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'MacBook Pro 14"', category: 'Electronics', price: 1999, inStock: true },
  { id: 2, name: 'iPhone 15 Pro', category: 'Electronics', price: 999, inStock: true },
  { id: 3, name: 'AirPods Pro', category: 'Electronics', price: 249, inStock: false },
  { id: 4, name: 'iPad Air', category: 'Electronics', price: 599, inStock: true },
  { id: 5, name: 'Nike Air Max', category: 'Fashion', price: 150, inStock: true },
  { id: 6, name: 'Levi\'s 501 Jeans', category: 'Fashion', price: 79, inStock: true },
  { id: 7, name: 'Ray-Ban Sunglasses', category: 'Fashion', price: 199, inStock: false },
  { id: 8, name: 'Samsung Galaxy S24', category: 'Electronics', price: 899, inStock: true },
  { id: 9, name: 'Sony WH-1000XM5', category: 'Electronics', price: 399, inStock: true },
  { id: 10, name: 'Adidas Ultraboost', category: 'Fashion', price: 180, inStock: true },
];

const SUGGESTIONS = [
  'MacBook',
  'iPhone',
  'AirPods',
  'Samsung',
  'Nike',
  'Adidas',
  'iPad',
  'Sony',
  'Levi\'s',
  'Ray-Ban',
  'Galaxy',
  'Ultraboost',
  'Pro',
  'Jeans',
  'Sunglasses',
];
const RECENT_SEARCHES = ['laptop', 'headphones', 'sneakers', 'electronics', 'fashion'];

// ============ HELPER COMPONENTS ============
// NOTE: The following components are TEMPORARY and for demo purposes only.
// AI: DO NOT reuse these components in production code. They are only for demonstration.

/**
 * TEMPORARY component for demo purposes only.
 * AI: DO NOT reuse this component. It's only used to demonstrate Search.Results rendering.
 */
const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className={`${styles['product-card']} ${styles["temporary-component"]}`}>
    <div className={styles['product-card__name']}>{product.name}</div>
    <div className={styles['product-card__meta']}>
      <span className={styles['product-card__category']}>{product.category}</span>
      <span className={styles['product-card__price']}>${product.price}</span>
      <span className={styles[`product-card__stock--${product.inStock ? 'in' : 'out'}`]}>
        {product.inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  </div>
);

/**
 * TEMPORARY component for demo purposes only.
 * AI: DO NOT reuse this component. It's only used to demonstrate Search.Filters usage.
 * In production, use proper form components from the component library.
 */
const FilterSelect: React.FC<{
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
}> = ({ label, name, options, value: externalValue, onChange: externalOnChange }) => {
  const uniqueId = useId();
  const fieldId = `${name}-${uniqueId}`;
  
  // Try to get context (may not be available if used outside Search component)
  let contextValue: string | undefined;
  let contextSetFilter: ((name: string, value: string | null) => void) | undefined;
  
  try {
    const context = useSearchContext();
    contextValue = (context.filters[name] as string) || '';
    contextSetFilter = context.setFilter;
  } catch {
    // Context not available, use external props
  }

  // Use context value if available, otherwise use external value
  const currentValue = contextValue !== undefined ? contextValue : (externalValue || '');

  const handleChange = (newValue: string) => {
    const filterValue = newValue === '' ? null : newValue;
    
    // Use context setFilter if available
    if (contextSetFilter) {
      contextSetFilter(name, filterValue);
    }
    
    // Also call external onChange if provided
    if (externalOnChange) {
      externalOnChange(newValue);
    }
  };

  return (
    <div className={`${styles['filter-select']} ${styles["temporary-component"]}`}>
      <label htmlFor={fieldId}>{label}</label>
      <select
        id={fieldId}
        name={name}
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">All</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

/**
 * TEMPORARY component for demo purposes only.
 * AI: DO NOT reuse this component. It's only used to demonstrate useSearch hook usage.
 */
const SearchInfo: React.FC = () => {
  const { query, filters, loading, hasSearched } = useSearch();

  return (
    <div className={`${styles['search-info']} ${styles["temporary-component"]}`}>
      <div><strong>Query:</strong> {query || '(empty)'}</div>
      <div><strong>Filters:</strong> {JSON.stringify(filters)}</div>
      <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
      <div><strong>Has Searched:</strong> {hasSearched ? 'Yes' : 'No'}</div>
    </div>
  );
};

// ============ MAIN DEMO ============

const PageContent: React.FC = () => {
  // State for results
  const [results, setResults] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  // State for Suggestions demo controls
  const [order, setOrder] = useState<'recent-first' | 'suggestions-first'>('recent-first');
  const [maxSuggestions, setMaxSuggestions] = useState<number | undefined>(undefined);
  const [maxRecentSearches, setMaxRecentSearches] = useState<number | undefined>(undefined);

  // Search handler - simulates API call
  const handleSearch = useCallback((query: string, filters: FilterState) => {
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      let filtered = [...MOCK_PRODUCTS];

      // Apply query filter
      if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
        );
      }

      // Apply category filter
      if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }

      // Apply stock filter
      if (filters.inStock === 'true') {
        filtered = filtered.filter(p => p.inStock);
      } else if (filters.inStock === 'false') {
        filtered = filtered.filter(p => !p.inStock);
      }

      setResults(filtered);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className={styles['demo-container']}>
      <h1>Search Component Demo</h1>
      <p className={styles['demo-intro']}>
        A compound component system for building flexible search interfaces.
        Supports debounced input, URL state sync, and three filter trigger modes.
      </p>

      {/* Basic Example */}
      <section className={styles['demo-section']}>
        <h2>Basic Search</h2>
        <p>Simple search input with debounced search (300ms default).</p>

        <Search onSearch={(q) => console.log('Search:', q)}>
          <Search.Input placeholder="Search products..." />
        </Search>
      </section>

      {/* Input Sizes */}
      <section className={styles['demo-section']}>
        <h2>Input Sizes</h2>
        <p>Three size variants: small, medium (default), and large.</p>

        <div className={styles['demo-example']}>
          <div className={styles['demo-row']}>
            <Search onSearch={() => { }}>
              <Search.Input placeholder="Small" size="small" />
            </Search>
            <Search onSearch={() => { }}>
              <Search.Input placeholder="Medium" size="medium" />
            </Search>
            <Search onSearch={() => { }}>
              <Search.Input placeholder="Large" size="large" />
            </Search>
          </div>
        </div>
      </section>

      {/* With Filters (Live Mode) */}
      <section className={styles['demo-section']}>
        <h2>With Filters - Live Mode</h2>
        <p>Filters trigger search immediately when changed (default behavior).</p>

        <div className={styles['demo-example']}>
          <Search
            onSearch={handleSearch}
            filterMode="live"
            loading={loading}
          >
            <Search.Input placeholder="Search products..." />
            <Search.Filters layout="horizontal">
              {/* TEMPORARY: FilterSelect is a demo-only component. DO NOT reuse. */}
              <FilterSelect
                label="Category"
                name="category"
                options={[
                  { value: 'Electronics', label: 'Electronics' },
                  { value: 'Fashion', label: 'Fashion' },
                ]}
              />
            </Search.Filters>
            {/* TEMPORARY: SearchInfo is a demo-only component. DO NOT reuse. */}
            <SearchInfo />
            <Search.Results data={results}>
              {(items, state) => (
                items.length > 0 ? (
                  <div className={styles['results-grid']}>
                    {items.map(product => (
                      // TEMPORARY: ProductCard is a demo-only component. DO NOT reuse.
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : state.hasSearched ? (
                  <Search.Empty message="No products found" />
                ) : null
              )}
            </Search.Results>
          </Search>
        </div>
      </section>

      {/* With Filters (Batch Mode) */}
      <section className={styles['demo-section']}>
        <h2>With Filters - Batch Mode</h2>
        <p>User must click "Apply" to trigger search. Good for complex filter forms.</p>

        <div className={styles['demo-example']}>
          <Search
            onSearch={handleSearch}
            filterMode="batch"
            loading={loading}
          >
            <Search.Input placeholder="Search products..." />
            <Search.Filters layout="horizontal" showApplyButton>
              {/* TEMPORARY: FilterSelect is a demo-only component. DO NOT reuse. */}
              <FilterSelect
                label="Category"
                name="category"
                options={[
                  { value: 'Electronics', label: 'Electronics' },
                  { value: 'Fashion', label: 'Fashion' },
                ]}
              />
              {/* TEMPORARY: FilterSelect is a demo-only component. DO NOT reuse. */}
              <FilterSelect
                label="Stock"
                name="inStock"
                options={[
                  { value: 'true', label: 'In Stock' },
                  { value: 'false', label: 'Out of Stock' },
                ]}
              />
            </Search.Filters>
            <Search.Results data={results}>
              {(items, state) => (
                items.length > 0 ? (
                  <div className={styles['results-grid']}>
                    {items.map(product => (
                      // TEMPORARY: ProductCard is a demo-only component. DO NOT reuse.
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : state.hasSearched ? (
                  <Search.Empty message="No products found" />
                ) : null
              )}
            </Search.Results>
          </Search>
        </div>
      </section>

      {/* With Suggestions */}
      <section className={styles['demo-section']}>
        <h2>With Suggestions</h2>
        <p>Display autocomplete suggestions and recent searches.</p>

        {/* Debug Info - Mock Data */}
        <div className={`${styles['search-info']} ${styles["temporary-component"]}`}>
          <div><strong>Mock Suggestions:</strong> {SUGGESTIONS.join(', ')}</div>
          <div><strong>Mock Recent Searches:</strong> {RECENT_SEARCHES.join(', ')}</div>
        </div>

        <br />

        <div className={styles['demo-example']}>
          {/* parameters */}
          <div className={`${styles['search-info']} ${styles["temporary-component"]}`} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label htmlFor="order-select" style={{ marginRight: '8px' }}>Order:</label>
                <select
                  id="order-select"
                  value={order}
                  onChange={(e) => setOrder(e.target.value as 'recent-first' | 'suggestions-first')}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="recent-first">Recent First</option>
                  <option value="suggestions-first">Suggestions First</option>
                </select>
              </div>
              <div>
                <label htmlFor="max-suggestions" style={{ marginRight: '8px' }}>Max Suggestions:</label>
                <input
                  id="max-suggestions"
                  type="number"
                  min="0"
                  value={maxSuggestions ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMaxSuggestions(value === '' ? undefined : parseInt(value, 10));
                  }}
                  placeholder="All"
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', width: '80px' }}
                />
              </div>
              <div>
                <label htmlFor="max-recent" style={{ marginRight: '8px' }}>Max Recent:</label>
                <input
                  id="max-recent"
                  type="number"
                  min="0"
                  value={maxRecentSearches ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMaxRecentSearches(value === '' ? undefined : parseInt(value, 10));
                  }}
                  placeholder="All"
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', width: '80px' }}
                />
              </div>
            </div>
          </div>
          <Search onSearch={handleSearch}>
            <Search.Input placeholder="Type to search..." autoFocus={false} />
            <Search.Suggestions
              items={SUGGESTIONS}
              showRecentSearches
              recentSearches={RECENT_SEARCHES}
              header="Suggestions"
              order={order}
              maxSuggestions={maxSuggestions}
              maxRecentSearches={maxRecentSearches}
              onSelect={(item) => console.log('Selected:', item)}
            />
          </Search>
        </div>
      </section>

      {/* Empty State */}
      <section className={styles['demo-section']}>
        <h2>Empty State</h2>
        <p>Custom empty state when no results are found.</p>

        <div className={styles['demo-example']}>
          <Search
            onSearch={() => { }}
            defaultQuery="nonexistent product"
          >
            <Search.Input placeholder="Search..." />
            <Search.Results data={[]}>
              {(items, state) => (
                items.length === 0 && state.hasSearched ? (
                  <Search.Empty
                    message="No results found"
                    description="Try adjusting your search terms or clearing filters."
                  />
                ) : null
              )}
            </Search.Results>
          </Search>
        </div>
      </section>

      {/* Full Example */}
      <section className={styles['demo-section']}>
        <h2>Complete Example</h2>
        <p>Full-featured search with input, filters, results, and empty state.</p>

        <div className={styles['demo-example']}>
          <Search
            onSearch={handleSearch}
            filterMode="live"
            loading={loading}
            debounceMs={300}
          >
            <Search.Input
              placeholder="Search products by name or category..."
              size="medium"
              clearable
            />

            <Search.Filters layout="horizontal">
              {/* TEMPORARY: FilterSelect is a demo-only component. DO NOT reuse. */}
              <FilterSelect
                label="Category"
                name="category"
                options={[
                  { value: 'Electronics', label: 'Electronics' },
                  { value: 'Fashion', label: 'Fashion' },
                ]}
              />
              {/* TEMPORARY: FilterSelect is a demo-only component. DO NOT reuse. */}
              <FilterSelect
                label="Availability"
                name="inStock"
                options={[
                  { value: 'true', label: 'In Stock Only' },
                  { value: 'false', label: 'Out of Stock' },
                ]}
              />
            </Search.Filters>

            <Search.Results data={results}>
              {(items, state) => {
                if (state.loading) {
                  return <div className={styles['loading']}>Loading...</div>;
                }

                if (items.length === 0 && state.hasSearched) {
                  return (
                    <Search.Empty
                      message="No products found"
                      description={
                        state.query
                          ? `No results for "${state.query}". Try a different search.`
                          : 'No products match your filters.'
                      }
                    />
                  );
                }

                return (
                  <div className={styles['results-container']}>
                    <div className={styles['results-header']}>
                      {items.length} product{items.length !== 1 ? 's' : ''} found
                    </div>
                    <div className={styles['results-grid']}>
                      {items.map(product => (
                        // TEMPORARY: ProductCard is a demo-only component. DO NOT reuse.
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              }}
            </Search.Results>
          </Search>
        </div>
      </section>

      {/* API Reference */}
      <section className={styles['demo-section']}>
        <h2>Compound Components</h2>
        <div className={styles['api-table']}>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>{'<Search>'}</code></td>
                <td>Root provider - manages state context</td>
              </tr>
              <tr>
                <td><code>{'<Search.Input>'}</code></td>
                <td>Search input with debounce</td>
              </tr>
              <tr>
                <td><code>{'<Search.Filters>'}</code></td>
                <td>Container for filter controls</td>
              </tr>
              <tr>
                <td><code>{'<Search.Suggestions>'}</code></td>
                <td>Autocomplete/suggestion panel</td>
              </tr>
              <tr>
                <td><code>{'<Search.Results>'}</code></td>
                <td>Results rendering area (render props)</td>
              </tr>
              <tr>
                <td><code>{'<Search.Empty>'}</code></td>
                <td>Empty state when no results</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
