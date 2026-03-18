/**
 * MultiSelect Component - Main Implementation
 */

import React from 'react';
import styles from './styles.module.scss';
import type { MultiSelectProps } from './types';
import { MultiSelectContent } from './ComponentContent';

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
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
      styles["multi-select"],
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
        <MultiSelectContent>
          {children}
        </MultiSelectContent>
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
