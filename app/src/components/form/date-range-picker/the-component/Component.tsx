/**
 * DateRangePicker Component - Main Implementation
 */

import React from 'react';
import styles from './styles.module.scss';
import type { DateRangePickerProps } from './types';
import { DateRangePickerContent } from './ComponentContent';

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
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
      styles["date-range-picker"],
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
        <DateRangePickerContent>
          {children}
        </DateRangePickerContent>
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
