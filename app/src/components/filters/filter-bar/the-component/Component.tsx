/**
 * FilterBar Component - Main Implementation
 */

import React from 'react';
import styles from './styles.module.scss';
import type { FilterBarProps } from './types';
import { FilterBarContent } from './ComponentContent';

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (props, ref) => {
    const {
      children,
      variant = 'default',
      size = 'medium',
      disabled = false,
      className,
      ...restProps
    } = props;

    // Build className
    const componentClassName = [
      styles["filter-bar"],
      className,
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={componentClassName}
        data-variant={variant}
        data-size={size}
        data-disabled={disabled}
        {...restProps}
      >
        <FilterBarContent>
          {children}
        </FilterBarContent>
      </div>
    );
  }
);

FilterBar.displayName = 'FilterBar';
