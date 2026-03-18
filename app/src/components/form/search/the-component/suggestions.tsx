/**
 * Search Suggestions Component
 * 
 * Dropdown panel for search suggestions and recent searches.
 * Uses DropdownMenu internally for proper positioning and keyboard navigation.
 */

import React, { useCallback, useMemo, useReducer, useEffect } from 'react';
import { DropdownMenu, useDropdownMenuContext } from '../../../general/dropdown-menu';
import styles from './styles.module.scss';
import type { SearchSuggestionsProps } from './types';
import { useSearchContext } from './context';

/**
 * Helper component to override the trigger ref with the Search Input ref.
 * This allows the suggestions dropdown to position itself relative to the Input element.
 */
function InputRefBridge({ inputRef }: { inputRef: React.RefObject<HTMLDivElement | null> | null }) {
  const { setTriggerRef } = useDropdownMenuContext();
  
  useEffect(() => {
    if (inputRef) {
      setTriggerRef(inputRef as React.RefObject<HTMLElement | null>);
    }
  }, [inputRef, setTriggerRef]);
  
  return null;
}

type MenuState = {
  isOpen: boolean;
  manuallyClosed: boolean;
  prevQuery: string;
};

type MenuAction =
  | { type: 'QUERY_CHANGED'; query: string; shouldShow: boolean }
  | { type: 'SHOULD_SHOW_CHANGED'; shouldShow: boolean }
  | { type: 'MANUAL_CLOSE' }
  | { type: 'MANUAL_OPEN' }
  | { type: 'USER_TYPING' };

function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case 'QUERY_CHANGED':
      // Don't reset manuallyClosed - only update prevQuery
      // This prevents the menu from reopening after clicking a suggestion
      return {
        ...state,
        prevQuery: action.query,
        // Keep manuallyClosed as is, only update isOpen if not manually closed
        isOpen: state.manuallyClosed ? false : action.shouldShow,
      };
    case 'SHOULD_SHOW_CHANGED':
      if (state.manuallyClosed) {
        return state;
      }
      return {
        ...state,
        isOpen: action.shouldShow,
      };
    case 'MANUAL_CLOSE':
      return {
        ...state,
        isOpen: false,
        manuallyClosed: true,
      };
    case 'MANUAL_OPEN':
      return {
        ...state,
        isOpen: true,
        manuallyClosed: false,
      };
    case 'USER_TYPING':
      // Reset manuallyClosed when user actively types
      return {
        ...state,
        manuallyClosed: false,
      };
    default:
      return state;
  }
}

export function SearchSuggestions<T>({
  items = [],
  renderItem,
  onSelect,
  showRecentSearches = false,
  recentSearches = [],
  header,
  emptyMessage = 'No suggestions',
  order = 'recent-first',
  maxSuggestions,
  maxRecentSearches,
  className,
}: SearchSuggestionsProps<T>) {
  const { query, setQuery, search, inputRef } = useSearchContext();

  // Apply quantity limits using useMemo
  const limitedItems = useMemo(() => {
    if (maxSuggestions !== undefined && maxSuggestions > 0) {
      return items.slice(0, maxSuggestions);
    }
    return items;
  }, [items, maxSuggestions]);

  const limitedRecentSearches = useMemo(() => {
    if (maxRecentSearches !== undefined && maxRecentSearches > 0) {
      return recentSearches.slice(0, maxRecentSearches);
    }
    return recentSearches;
  }, [recentSearches, maxRecentSearches]);

  // Compute whether menu should be shown based on content and query (using limited arrays)
  const shouldShowMenu = useMemo(() => {
    const hasContent = limitedItems.length > 0 || (showRecentSearches && limitedRecentSearches.length > 0);
    return hasContent && query.length > 0;
  }, [limitedItems.length, showRecentSearches, limitedRecentSearches.length, query.length]);

  // Use reducer to manage menu state
  const [menuState, dispatch] = useReducer(menuReducer, {
    isOpen: false,
    manuallyClosed: false,
    prevQuery: query,
  });

  // Handle query changes
  useEffect(() => {
    if (menuState.prevQuery !== query) {
      // Detect if this is likely user typing vs programmatic change
      // User typing typically changes query length by small amounts (1-3 chars at a time)
      const prevLen = menuState.prevQuery.length;
      const currLen = query.length;
      const lengthDiff = Math.abs(currLen - prevLen);
      const isLikelyUserTyping = lengthDiff <= 3;
      
      // If likely user typing and menu was manually closed, reset the manual close flag
      if (isLikelyUserTyping && menuState.manuallyClosed) {
        dispatch({ type: 'USER_TYPING' });
      }
      
      dispatch({ type: 'QUERY_CHANGED', query, shouldShow: shouldShowMenu });
    }
  }, [query, shouldShowMenu, menuState.prevQuery, menuState.manuallyClosed]);

  // Handle shouldShowMenu changes (when not manually closed)
  useEffect(() => {
    if (menuState.prevQuery === query) {
      dispatch({ type: 'SHOULD_SHOW_CHANGED', shouldShow: shouldShowMenu });
    }
  }, [shouldShowMenu, query, menuState.prevQuery]);

  // Final open state combines shouldShowMenu and menuState.isOpen
  const isOpen = menuState.isOpen && shouldShowMenu;

  // Handle menu open state changes from DropdownMenu
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      dispatch({ type: 'MANUAL_OPEN' });
    } else {
      dispatch({ type: 'MANUAL_CLOSE' });
    }
  }, []);

  // Handle suggestion click
  const handleSelect = useCallback((item: T) => {
    dispatch({ type: 'MANUAL_CLOSE' });
    // Update the input field with the selected suggestion
    const itemAsString = String(item);
    setQuery(itemAsString);
    search();
    // Also call the onSelect callback if provided
    if (onSelect) {
      onSelect(item);
    }
  }, [onSelect, setQuery, search]);

  // Handle recent search click
  const handleRecentClick = useCallback((term: string) => {
    dispatch({ type: 'MANUAL_CLOSE' });
    setQuery(term);
    search();
  }, [setQuery, search]);

  // Use limited arrays for display logic
  const hasItems = limitedItems.length > 0;
  const hasRecentSearches = showRecentSearches && limitedRecentSearches.length > 0;
  const isEmpty = !hasItems && !hasRecentSearches;

  // Build className for wrapper
  const suggestionsClassName = [
    styles['search-suggestions-wrapper'],
    className,
  ].filter(Boolean).join(' ');

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className={suggestionsClassName}>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        {/* Bridge to use Search.Input ref for positioning */}
        <InputRefBridge inputRef={inputRef} />

        <DropdownMenu.Content 
          align="start" 
          className={styles['search-suggestions']}
        >
          {/* Render sections based on order prop */}
          {order === 'recent-first' ? (
            <>
              {/* Recent searches section */}
              {hasRecentSearches && (
                <DropdownMenu.Group>
                  <DropdownMenu.Label>Recent Searches</DropdownMenu.Label>
                  {limitedRecentSearches.map((term, index) => (
                    <DropdownMenu.ItemButton
                      key={`recent-${index}`}
                      label={term}
                      icon="history"
                      onSelect={() => handleRecentClick(term)}
                    />
                  ))}
                </DropdownMenu.Group>
              )}

              {hasRecentSearches && hasItems && (
                <DropdownMenu.Separator />
              )}

              {/* Suggestions section */}
              {hasItems && (
                <DropdownMenu.Group>
                  {header && (
                    <DropdownMenu.Label>{header}</DropdownMenu.Label>
                  )}
                  {limitedItems.map((item, index) => {
                    // Use ItemButton for standard rendering, Item for custom rendering
                    if (renderItem) {
                      return (
                        <DropdownMenu.Item
                          key={index}
                          onSelect={() => handleSelect(item)}
                        >
                          {renderItem(item, index)}
                        </DropdownMenu.Item>
                      );
                    }
                    return (
                      <DropdownMenu.ItemButton
                        key={index}
                        label={String(item)}
                        icon="search"
                        onSelect={() => handleSelect(item)}
                      />
                    );
                  })}
                </DropdownMenu.Group>
              )}
            </>
          ) : (
            <>
              {/* Suggestions section */}
              {hasItems && (
                <DropdownMenu.Group>
                  {header && (
                    <DropdownMenu.Label>{header}</DropdownMenu.Label>
                  )}
                  {limitedItems.map((item, index) => {
                    // Use ItemButton for standard rendering, Item for custom rendering
                    if (renderItem) {
                      return (
                        <DropdownMenu.Item
                          key={index}
                          onSelect={() => handleSelect(item)}
                        >
                          {renderItem(item, index)}
                        </DropdownMenu.Item>
                      );
                    }
                    return (
                      <DropdownMenu.ItemButton
                        key={index}
                        label={String(item)}
                        icon="search"
                        onSelect={() => handleSelect(item)}
                      />
                    );
                  })}
                </DropdownMenu.Group>
              )}

              {hasItems && hasRecentSearches && (
                <DropdownMenu.Separator />
              )}

              {/* Recent searches section */}
              {hasRecentSearches && (
                <DropdownMenu.Group>
                  <DropdownMenu.Label>Recent Searches</DropdownMenu.Label>
                  {limitedRecentSearches.map((term, index) => (
                    <DropdownMenu.ItemButton
                      key={`recent-${index}`}
                      label={term}
                      icon="history"
                      onSelect={() => handleRecentClick(term)}
                    />
                  ))}
                </DropdownMenu.Group>
              )}
            </>
          )}

          {/* Empty state */}
          {isEmpty && (
            <div className={styles['search-suggestions__empty']}>
              {emptyMessage}
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}

SearchSuggestions.displayName = 'Search.Suggestions';
