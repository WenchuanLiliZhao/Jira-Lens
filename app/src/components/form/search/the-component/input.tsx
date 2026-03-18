/**
 * Search Input Component
 * 
 * The search input field with built-in debouncing support.
 * Uses context from the parent Search component.
 */

import React, { useRef, useCallback, useEffect, useId } from 'react';
import styles from './styles.module.scss';
import type { SearchInputProps } from './types';
import { useSearchContext } from './context';
import { Spinner } from '../../../feedback/spinner';
import { Icon } from '../../../general/icon';

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  autoFocus = false,
  clearable = true,
  leadingIcon,
  trailingIcon,
  size = 'medium',
  className,
  'aria-label': ariaLabel,
  id: providedId,
  name,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, search, loading, filterMode, setInputRef } = useSearchContext();
  const generatedId = useId();
  const inputId = providedId || `search-input-${generatedId}`;

  // Register container ref to context for suggestions positioning
  useEffect(() => {
    setInputRef(containerRef);
  }, [setInputRef]);

  // Auto focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, [setQuery]);

  // Handle clear button click
  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, [setQuery]);

  // Handle key down (Enter to search in non-live mode)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filterMode !== 'live') {
      e.preventDefault();
      search();
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [filterMode, search, handleClear]);

  // Show clear button when has value
  const showClearButton = clearable && query.length > 0;

  // Build className
  const inputClassName = [
    styles['search-input'],
    styles[`search-input--${size}`],
    loading && styles['search-input--loading'],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={inputClassName}>
      <span className={styles['search-input__icon']}>
        {leadingIcon || <Icon icon="search" />}
      </span>
      
      <input
        ref={inputRef}
        type="text"
        id={inputId}
        name={name || inputId}
        role="searchbox"
        className={styles['search-input__field']}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {loading && (
        <div style={{ position: 'absolute', right: '12px' }}>
          <Spinner size="small" aria-label="Searching" />
        </div>
      )}

      {showClearButton && !loading && (
        <button
          type="button"
          className={styles['search-input__clear']}
          onClick={handleClear}
          aria-label="Clear search"
          tabIndex={-1}
        >
          <Icon icon="close" />
        </button>
      )}

      {trailingIcon && (
        <span className={styles['search-input__trailing']}>
          {trailingIcon}
        </span>
      )}
    </div>
  );
};

SearchInput.displayName = 'Search.Input';
